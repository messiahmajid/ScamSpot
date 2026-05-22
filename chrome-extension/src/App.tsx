import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from './config';
import './App.css';

interface FlaggedUrl {
    url: string;
    score: number;
    reasons: string[];
}

interface ScanStats {
    totalScanned: number;
    totalFlagged: number;
    lastScanTime: number;
    platform: string;
    flaggedUrls: FlaggedUrl[];
}

const PLATFORMS: Record<string, string> = {
    'mail.google.com': 'Gmail',
    'web.whatsapp.com': 'WhatsApp',
    'web.telegram.org': 'Telegram',
    'www.instagram.com': 'Instagram',
    'web.snapchat.com': 'Snapchat',
    'messenger.com': 'Messenger',
    'localhost': 'Demo'
};

function timeAgo(ts: number): string {
    if (!ts) return 'Never';
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    return Math.floor(diff / 3600000) + 'h ago';
}

function hostnameFromUrl(url: string): string {
    try { return new URL(url).hostname; }
    catch { return url; }
}

function App() {
    const [stats, setStats] = useState<ScanStats>({
        totalScanned: 0, totalFlagged: 0, lastScanTime: 0, platform: 'unknown', flaggedUrls: []
    });
    const [backendAvailable, setBackendAvailable] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState('');

    useEffect(() => {
        chrome.storage.local.get(['scamspot_stats'], result => {
            if (result.scamspot_stats) setStats(result.scamspot_stats);
        });

        const handler = (changes: Record<string, chrome.storage.StorageChange>) => {
            if (changes.scamspot_stats) setStats(changes.scamspot_stats.newValue);
        };
        chrome.storage.onChanged.addListener(handler);

        fetch(BACKEND_URL + '/health', { signal: AbortSignal.timeout(2000) })
            .then(r => setBackendAvailable(r.ok))
            .catch(() => setBackendAvailable(false));

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (!tabs[0]?.url) return;
            try {
                const hostname = new URL(tabs[0].url).hostname;
                for (const [domain, name] of Object.entries(PLATFORMS)) {
                    if (hostname.includes(domain)) {
                        setCurrentPlatform(name);
                        return;
                    }
                }
                setCurrentPlatform('');
            } catch { setCurrentPlatform(''); }
        });

        return () => chrome.storage.onChanged.removeListener(handler);
    }, []);

    const handleRescan = () => {
        setScanning(true);
        const onDone = (changes: Record<string, chrome.storage.StorageChange>) => {
            if (changes.scamspot_stats) {
                setScanning(false);
                chrome.storage.onChanged.removeListener(onDone);
            }
        };
        chrome.storage.onChanged.addListener(onDone);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'CHECK_LINKS' }).catch(() => {
                    setScanning(false);
                    chrome.storage.onChanged.removeListener(onDone);
                });
            } else {
                setScanning(false);
                chrome.storage.onChanged.removeListener(onDone);
            }
        });
        setTimeout(() => {
            setScanning(false);
            chrome.storage.onChanged.removeListener(onDone);
        }, 10000);
    };

    const isProtected = !!currentPlatform;
    const flaggedCount = stats.totalFlagged || 0;
    const scannedCount = stats.totalScanned || 0;
    const reviewCount = stats.flaggedUrls?.length || 0;
    const hasFlaggedUrls = reviewCount > 0;
    const riskState = flaggedCount > 0 ? 'Review needed' : 'Clear';
    const riskClass = flaggedCount > 0 ? 'elevated' : 'clear';
    const scanButtonLabel = scanning ? 'Scanning' : 'Scan now';

    return (
        <div className="popup">
            <header className="popup-header">
                <div className="popup-brand">
                    <span className="popup-mark" aria-hidden="true">
                        <span className="popup-mark-core">S</span>
                    </span>
                    <div>
                        <h1>ScamSpot</h1>
                        <p>Phishing link console</p>
                    </div>
                </div>
                <span className={'popup-status ' + (isProtected ? 'active' : 'inactive')}>
                    {isProtected ? 'Active' : 'Inactive'}
                </span>
            </header>

            <section className="surface-panel" aria-label="Current protection status">
                <div className="platform-row">
                    <span className="meta-label">Surface</span>
                    <strong>{currentPlatform || 'Unsupported page'}</strong>
                </div>
                <p className="platform-note">
                    {currentPlatform
                        ? 'Scanning links on this tab as content changes.'
                        : 'Open Gmail, a supported chat app, or the local demo page.'}
                </p>
            </section>

            <section className="risk-panel" aria-label="Scan summary">
                <div className={'risk-dial ' + riskClass}>
                    <span className="risk-dial-label">{riskState}</span>
                    <strong>{flaggedCount}</strong>
                    <span>flagged</span>
                </div>
                <div className="scan-metrics">
                    <div className="stat">
                        <div className="stat-value">{scannedCount}</div>
                        <div className="stat-label">Scanned</div>
                    </div>
                    <div className="stat">
                        <div className="stat-value">{reviewCount}</div>
                        <div className="stat-label">In queue</div>
                    </div>
                    <div className="stat meta-stat">
                        <div className="stat-value small">{timeAgo(stats.lastScanTime)}</div>
                        <div className="stat-label">Last scan</div>
                    </div>
                </div>
            </section>

            <button
                className={'popup-scan-btn' + (scanning ? ' is-loading' : '')}
                onClick={handleRescan}
                disabled={scanning || !isProtected}
                aria-busy={scanning}
            >
                <span className="scan-icon" aria-hidden="true" />
                <span>{scanButtonLabel}</span>
            </button>

            <section className="popup-flagged" aria-label="Flagged URLs">
                <div className="section-heading">
                    <h2>Flagged URLs</h2>
                    <span>{hasFlaggedUrls ? `${reviewCount} recent` : 'None'}</span>
                </div>

                {hasFlaggedUrls ? (
                    <ul>
                        {stats.flaggedUrls.slice(-5).reverse().map((item, i) => {
                            const hostname = hostnameFromUrl(item.url);
                            const reason = item.reasons[0] || 'Suspicious link pattern';
                            return (
                                <li key={i} title={item.reasons.join(', ')}>
                                    <span className="flagged-copy">
                                        <span className="flagged-url">{hostname}</span>
                                        <span className="flagged-reason">{reason}</span>
                                    </span>
                                    <span className={'flagged-score ' + (item.score >= 70 ? 'high' : 'medium')}>
                                        {item.score}%
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="empty-state">No risky links are waiting for review.</p>
                )}
            </section>

            <footer className="popup-footer">
                <span className={'backend-status ' + (backendAvailable ? 'connected' : '')}>
                    {backendAvailable ? 'Backend Connected' : 'Standalone Mode'}
                </span>
                <span className="version">v1.0.0</span>
            </footer>
        </div>
    );
}

export default App;
