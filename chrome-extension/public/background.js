const DEFAULT_DOMAINS = [
    'mail.google.com',
    'web.whatsapp.com',
    'web.telegram.org',
    'www.instagram.com',
    'web.snapchat.com',
    'messenger.com',
    'localhost'
];

function isAllowedDomain(url) {
    try {
        const hostname = new URL(url).hostname;
        return DEFAULT_DOMAINS.some(domain => hostname.includes(domain));
    } catch {
        return false;
    }
}

async function ensureContentScriptAndScan(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            files: ["contentScript.js"]
        });
    } catch { /* already injected or tab not scriptable */ }
    chrome.tabs.sendMessage(tabId, { action: "CHECK_LINKS" }).catch(() => {});
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        enabledDomains: DEFAULT_DOMAINS.reduce((acc, domain) => ({ ...acc, [domain]: true }), {})
    });

    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            if (tab.id && tab.url && isAllowedDomain(tab.url)) {
                ensureContentScriptAndScan(tab.id);
            }
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && isAllowedDomain(tab.url)) {
        ensureContentScriptAndScan(tabId);
    }
});
