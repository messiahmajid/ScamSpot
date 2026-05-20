import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

const SCRIPT_PATH = path.resolve(__dirname, '../public/contentScript.js');
const scriptSource = fs.readFileSync(SCRIPT_PATH, 'utf8');

function createLink(href: string) {
    const classes = new Set<string>();
    return {
        href,
        innerText: '',
        getAttribute: () => '',
        closest: () => null,
        parentElement: { innerText: '' },
        classList: {
            add: (c: string) => classes.add(c),
            remove: (c: string) => classes.delete(c),
            contains: (c: string) => classes.has(c),
        },
        setAttribute: () => {},
        appendChild: () => {},
        addEventListener: () => {},
        querySelector: () => null,
        removeAttribute: () => {},
        cloneNode: () => createLink(href),
    };
}

function createTestEnv(options: {
    links?: ReturnType<typeof createLink>[];
    preloadCache?: Record<string, any>;
} = {}) {
    const storage: Record<string, any> = {};
    if (options.preloadCache) storage.scamspot_cache = options.preloadCache;

    let messageListener: ((msg: any) => void) | null = null;
    const pendingTimers: Array<{ fn: Function; cleared: boolean }> = [];

    let fetchImpl: (...args: any[]) => Promise<any> = () =>
        Promise.reject(new Error('no backend'));

    const ctx = vm.createContext({
        window: { location: { hostname: 'mail.google.com' } },
        console: { log: () => {}, warn: () => {}, error: () => {} },
        chrome: {
            storage: {
                local: {
                    get: (keys: string[]) => {
                        const result: any = {};
                        keys.forEach(k => {
                            if (storage[k] !== undefined) result[k] = storage[k];
                        });
                        return Promise.resolve(result);
                    },
                    set: (items: any) => {
                        Object.assign(storage, items);
                        return Promise.resolve();
                    },
                },
                onChanged: { addListener: () => {}, removeListener: () => {} },
            },
            runtime: {
                onMessage: { addListener: (fn: Function) => { messageListener = fn as any; } },
            },
        },
        document: {
            readyState: 'complete',
            getElementById: () => null,
            createElement: () => {
                const el: any = {
                    id: '', className: '', textContent: '', innerHTML: '',
                    style: { cssText: '' },
                    setAttribute: () => {}, appendChild: () => {},
                    addEventListener: () => {}, remove: () => {},
                };
                el.querySelector = () => el;
                el.querySelectorAll = () => [];
                return el;
            },
            head: { appendChild: () => {} },
            body: { appendChild: () => {}, innerText: '', firstChild: null },
            querySelectorAll: (sel: string) => sel === 'a' ? (options.links || []) : [],
        },
        fetch: (...args: any[]) => fetchImpl(...args),
        AbortSignal: { timeout: () => ({}) },
        MutationObserver: class { observe() {} disconnect() {} },
        setTimeout: (fn: Function) => {
            const entry = { fn, cleared: false };
            pendingTimers.push(entry);
            return pendingTimers.length;
        },
        clearTimeout: (id: any) => {
            if (id != null && pendingTimers[id - 1]) pendingTimers[id - 1].cleared = true;
        },
        URL: globalThis.URL,
        Promise,
    });

    vm.runInContext(scriptSource, ctx);

    return {
        storage,
        sendMessage: (msg: any) => messageListener?.(msg),
        flushTimers: () => {
            const active = pendingTimers.filter(t => !t.cleared);
            pendingTimers.length = 0;
            active.forEach(t => t.fn());
        },
        setFetch: (impl: typeof fetchImpl) => { fetchImpl = impl; },
    };
}

const settle = () => new Promise(r => setTimeout(r, 100));

describe('content script scanner', () => {
    test('no links found still updates scan time', async () => {
        const env = createTestEnv({ links: [] });
        await settle();
        env.flushTimers();

        expect(env.storage.scamspot_stats).toBeDefined();
        expect(env.storage.scamspot_stats.lastScanTime).toBeGreaterThan(0);
    });

    test('all links cached still updates scan time', async () => {
        const link = createLink('https://example.com');
        const env = createTestEnv({
            links: [link],
            preloadCache: {
                'https://example.com': {
                    score: 0, isRisky: false, reasons: [],
                    source: 'local', timestamp: Date.now(),
                },
            },
        });
        await settle();
        env.flushTimers();

        expect(env.storage.scamspot_stats).toBeDefined();
        expect(env.storage.scamspot_stats.lastScanTime).toBeGreaterThan(0);
        expect(env.storage.scamspot_stats.totalScanned).toBe(0);
    });

    test('backend unavailable falls back to local heuristics', async () => {
        const link = createLink('http://paypal-verify-account.xyz/login?credential=1');
        const env = createTestEnv({ links: [link] });
        await settle();
        env.flushTimers();

        expect(env.storage.scamspot_stats.totalFlagged).toBeGreaterThan(0);

        const cache = env.storage.scamspot_cache;
        const verdict = cache['http://paypal-verify-account.xyz/login?credential=1'];
        expect(verdict).toBeDefined();
        expect(verdict.source).toBe('local');
        expect(verdict.isRisky).toBe(true);
    });

    test('manual scan upgrades local verdicts when backend becomes available', async () => {
        const link = createLink('https://example-check.xyz/path');
        const env = createTestEnv({ links: [link] });

        await settle();
        env.flushTimers();

        expect(env.storage.scamspot_cache['https://example-check.xyz/path'].source).toBe('local');

        env.setFetch((url: string) => {
            if (url.includes('/health')) return Promise.resolve({ ok: true });
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    highRiskUrls: [{
                        url: 'https://example-check.xyz/path',
                        score: 90,
                        reasons: ['Backend flagged this URL'],
                    }],
                }),
            });
        });

        env.sendMessage({ action: 'CHECK_LINKS' });
        await settle();
        env.flushTimers();

        const verdict = env.storage.scamspot_cache['https://example-check.xyz/path'];
        expect(verdict.source).toBe('backend');
        expect(verdict.score).toBe(90);
    });
});
