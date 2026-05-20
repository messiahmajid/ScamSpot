import '@testing-library/jest-dom';

if (typeof AbortSignal.timeout !== 'function') {
    AbortSignal.timeout = (ms: number) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), ms);
        return controller.signal;
    };
}

(globalThis as any).fetch = () => Promise.reject(new Error('no network in test'));

const chromeMock = {
    storage: {
        local: {
            get: (_keys: any, cb?: Function) => { if (cb) cb({}); return Promise.resolve({}); },
            set: (_items: any, cb?: Function) => { if (cb) cb(); return Promise.resolve(); },
        },
        onChanged: {
            addListener: () => {},
            removeListener: () => {},
        },
    },
    runtime: {
        onMessage: { addListener: () => {}, removeListener: () => {} },
        sendMessage: () => {},
    },
    tabs: {
        query: (_q: any, cb?: Function) => { if (cb) cb([]); },
        sendMessage: () => Promise.resolve(),
    },
};

(globalThis as any).chrome = chromeMock;
