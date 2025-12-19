// background.js - Service Worker for background tasks

const DEFAULT_DOMAINS = [
    'mail.google.com',
    'web.whatsapp.com',
    'web.telegram.org',
    'www.instagram.com',
    'web.snapchat.com',
    'messenger.com'
];

// ✅ Function to check if a URL belongs to selected domains
function isAllowedDomain(url) {
    try {
        const hostname = new URL(url).hostname;
        return DEFAULT_DOMAINS.some(domain => hostname.includes(domain));
    } catch (err) {
        return false;
    }
}

// On installation, initialize storage values and inject content script
chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 Extension Installed");

    // Initialize monitoring, screenshots, alerts, and enabledDomains
    chrome.storage.local.set({
        monitoring: false,
        screenshots: [],
        alerts: [],
        enabledDomains: DEFAULT_DOMAINS.reduce((acc, domain) => ({ ...acc, [domain]: true }), {})
    });

    // ✅ Inject content script into all active tabs on install
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.id && tab.url && tab.url.startsWith("http")) {
                injectContentScript(tab.id, tab.url);
            }
        });
    });
});

let monitoring = false;
let intervalId = null;

// ✅ Automatically start monitoring when visiting an allowed domain
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && isAllowedDomain(changeInfo.url)) {
        console.log(`🌍 Auto-start monitoring on: ${changeInfo.url}`);

        chrome.storage.local.set({ monitoring: true });

        // ✅ Inject content script only if not already injected
        injectContentScript(tabId, changeInfo.url);

        // ✅ Notify content script to start validation
        chrome.tabs.sendMessage(tabId, { action: "CHECK_LINKS" });

        console.log("🔍 Started monitoring and validated links.");
    }
});

// ✅ Function to inject content script safely
function injectContentScript(tabId, url) {
    chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            if (window.__SCAMSTOP_INJECTED__) {
                console.log("🚫 Content script already injected. Skipping...");
                return;
            }
            window.__SCAMSTOP_INJECTED__ = true;

            // ✅ Load content script dynamically
            const script = document.createElement("script");
            script.src = chrome.runtime.getURL("contentScript.js");
            document.head.appendChild(script);
            console.log("📥 Content script injected dynamically.");
        }
    });
}

// ✅ Capture Screenshot and Analyze
async function captureScreenshotAndAnalyze() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;

    const tabUrl = new URL(tab.url);

    chrome.storage.local.get({ enabledDomains: {} }, (result) => {
        const enabledDomains = result.enabledDomains;
        const allowed = Object.keys(enabledDomains).some(domain => enabledDomains[domain] && tabUrl.hostname.includes(domain));

        if (!allowed) return;

        // Capture screenshot (keep last 5)
        chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
            if (chrome.runtime.lastError || !dataUrl) return;
            chrome.storage.local.get({ screenshots: [] }, (result) => {
                const updated = [dataUrl, ...result.screenshots.slice(0, 4)];
                chrome.storage.local.set({ screenshots: updated });
            });
        });

        // Execute phishing detection
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: detectPhishingContent
        }, (results) => {
            if (results && results[0]?.result?.count > 0) {
                chrome.storage.local.get({ alerts: [] }, (result) => {
                    const newAlert = {
                        timestamp: Date.now(),
                        message: `Detected ${results[0].result.count} phishing keywords`,
                        riskLevel: Math.min(100, results[0].result.count * 20),
                        tags: results[0].result.matches
                    };
                    const updated = [newAlert, ...result.alerts.slice(0, 4)];
                    chrome.storage.local.set({ alerts: updated });
                });
            }
        });
    });
}

// ✅ Message Handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "START_MONITORING" && !monitoring) {
        monitoring = true;
        chrome.storage.local.set({ monitoring: true });
        console.log("🟢 Monitoring started...");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) return;
            injectContentScript(tabs[0].id, tabs[0].url);
        });

        captureScreenshotAndAnalyze();
        intervalId = setInterval(captureScreenshotAndAnalyze, 12000);
    }

    if (message.action === "STOP_MONITORING" && monitoring) {
        monitoring = false;
        chrome.storage.local.set({ monitoring: false });
        clearInterval(intervalId);
        console.log("🔴 Monitoring stopped.");
    }

    if (message.type === 'DOM_CHANGE') {
        captureScreenshotAndAnalyze();
    }
});

// ✅ Function to detect phishing content
function detectPhishingContent() {
    const phishingKeywords = ["verify", "urgent", "password", "account", "suspended", "action required"];
    const text = document.body.innerText.toLowerCase();
    const matches = phishingKeywords.filter(keyword => text.includes(keyword));
    return { matches, count: matches.length };
}

// ✅ Keep the service worker alive
chrome.alarms.create("keepAlive", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive" && monitoring) {
        console.log("⏳ Background worker kept alive");
    }
});

// ✅ Inject content script when a message is received
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "START_MONITORING") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]?.id) return;
            chrome.tabs.sendMessage(tabs[0].id, { action: "CHECK_LINKS" });
            injectContentScript(tabs[0].id, tabs[0].url);
        });
    }
});
