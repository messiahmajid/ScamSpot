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

    return (
        <div className="popup">
            <header className="popup-header">
                <div className="popup-brand">
                    <span className="popup-shield">{'\u{1F6E1}'}️</span>
                    <h1>ScamSpot</h1>
                </div>
                <span className={'popup-status ' + (isProtected ? 'active' : 'inactive')}>
                    {isProtected ? 'Active' : 'Inactive'}
                </span>
            </header>

            {currentPlatform && (
                <div className="popup-platform">
                    Monitoring: <strong>{currentPlatform}</strong>
                </div>
            )}

            {!currentPlatform && (
                <div className="popup-platform">
                    Navigate to a supported platform to start scanning
                </div>
            )}

            <div className="popup-stats">
                <div className="stat">
                    <div className="stat-value">{stats.totalScanned}</div>
                    <div className="stat-label">Scanned</div>
                </div>
                <div className="stat">
                    <div className={'stat-value' + (stats.totalFlagged > 0 ? ' flagged' : '')}>
                        {stats.totalFlagged}
                    </div>
                    <div className="stat-label">Flagged</div>
                </div>
            </div>

            <div className="popup-meta">
                Last scan: {timeAgo(stats.lastScanTime)}
            </div>

            <button
                className="popup-scan-btn"
                onClick={handleRescan}
                disabled={scanning || !isProtected}
            >
                {scanning ? 'Scanning...' : 'Scan Now'}
            </button>

            {stats.flaggedUrls?.length > 0 && (
                <div className="popup-flagged">
                    <h3>Flagged URLs</h3>
                    <ul>
                        {stats.flaggedUrls.slice(-5).reverse().map((item, i) => {
                            let hostname: string;
                            try { hostname = new URL(item.url).hostname; }
                            catch { hostname = item.url; }
                            return (
                                <li key={i} title={item.reasons.join(', ')}>
                                    <span className="flagged-url">{hostname}</span>
                                    <span className={'flagged-score ' + (item.score >= 70 ? 'high' : 'medium')}>
                                        {item.score}%
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

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
