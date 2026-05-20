if (!window.__SCAMSPOT_LOADED__) {
  window.__SCAMSPOT_LOADED__ = true;

  const BACKEND_URL = "http://localhost:3000";
  const CACHE_TTL_SAFE = 60 * 60 * 1000;
  const CACHE_TTL_RISKY = 4 * 60 * 60 * 1000;
  const SCAN_DEBOUNCE = 1000;

  let backendAvailable = false;
  const processedLinks = new WeakSet();
  const verdictCache = new Map();
  const whitelist = new Set();
  let stats = { totalScanned: 0, totalFlagged: 0, lastScanTime: 0, platform: "unknown", flaggedUrls: [] };
  let saveTimeout = null;

  // --- Styles (scoped, no layout-breaking inline styles) ---

  function injectStyles() {
    if (document.getElementById("scamspot-styles")) return;
    const style = document.createElement("style");
    style.id = "scamspot-styles";
    style.textContent = `
      @keyframes scamspot-fadeIn {
        from { opacity: 0 }
        to { opacity: 1 }
      }
      @keyframes scamspot-slideUp {
        from { opacity: 0; transform: translateY(20px) scale(0.95) }
        to { opacity: 1; transform: translateY(0) scale(1) }
      }
      @keyframes scamspot-slideDown {
        from { opacity: 0; transform: translateY(-100%) }
        to { opacity: 1; transform: translateY(0) }
      }

      .scamspot-flagged {
        outline: 2px solid #ef4444 !important;
        outline-offset: 2px !important;
      }

      .scamspot-badge {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 16px !important;
        height: 16px !important;
        background: #ef4444 !important;
        color: #fff !important;
        border-radius: 50% !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        margin-left: 4px !important;
        vertical-align: middle !important;
        cursor: help !important;
        line-height: 1 !important;
        text-decoration: none !important;
        font-family: -apple-system, system-ui, sans-serif !important;
      }

      .scamspot-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(0, 0, 0, 0.6) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 2147483647 !important;
        animation: scamspot-fadeIn 0.2s ease !important;
        font-family: -apple-system, system-ui, 'Segoe UI', sans-serif !important;
        backdrop-filter: blur(4px) !important;
      }

      .scamspot-modal {
        background: #fff !important;
        border-radius: 16px !important;
        max-width: 420px !important;
        width: 90vw !important;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3) !important;
        color: #1a1a1a !important;
        animation: scamspot-slideUp 0.25s ease !important;
        overflow: hidden !important;
      }

      .scamspot-modal-header {
        padding: 28px 24px 16px !important;
        text-align: center !important;
      }

      .scamspot-modal-icon {
        font-size: 40px !important;
        margin-bottom: 8px !important;
        display: block !important;
      }

      .scamspot-modal-score {
        font-size: 48px !important;
        font-weight: 800 !important;
        line-height: 1 !important;
        margin-bottom: 4px !important;
      }
      .scamspot-modal-score.high { color: #ef4444 !important; }
      .scamspot-modal-score.medium { color: #f59e0b !important; }
      .scamspot-modal-score.low { color: #22c55e !important; }

      .scamspot-modal-label {
        font-size: 12px !important;
        color: #6b7280 !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
      }

      .scamspot-modal-url {
        padding: 0 24px !important;
        margin-bottom: 16px !important;
      }
      .scamspot-modal-url code {
        display: block !important;
        background: #f3f4f6 !important;
        padding: 10px 14px !important;
        border-radius: 8px !important;
        font-size: 12px !important;
        color: #374151 !important;
        word-break: break-all !important;
        font-family: 'SF Mono', Menlo, monospace !important;
      }

      .scamspot-modal-reasons {
        padding: 0 24px 16px !important;
      }
      .scamspot-modal-reasons ul {
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .scamspot-modal-reasons li {
        display: flex !important;
        align-items: flex-start !important;
        gap: 8px !important;
        padding: 6px 0 !important;
        font-size: 14px !important;
        color: #4b5563 !important;
        line-height: 1.4 !important;
      }
      .scamspot-modal-reasons li::before {
        content: '\\26A0\\FE0F' !important;
        flex-shrink: 0 !important;
      }

      .scamspot-modal-actions {
        padding: 16px 24px 24px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        border-top: 1px solid #e5e7eb !important;
      }

      .scamspot-btn {
        display: block !important;
        width: 100% !important;
        padding: 12px !important;
        border-radius: 10px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        border: none !important;
        transition: opacity 0.15s ease !important;
        font-family: -apple-system, system-ui, sans-serif !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }
      .scamspot-btn:hover { opacity: 0.85 !important; }

      .scamspot-btn-block {
        background: #1f2937 !important;
        color: #fff !important;
      }
      .scamspot-btn-continue {
        background: transparent !important;
        color: #6b7280 !important;
        border: 1px solid #d1d5db !important;
      }
      .scamspot-btn-report {
        background: transparent !important;
        color: #9ca3af !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        padding: 8px !important;
      }

      .scamspot-notification {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: linear-gradient(135deg, #1e293b, #334155) !important;
        color: #fff !important;
        padding: 12px 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        z-index: 2147483646 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        animation: scamspot-slideDown 0.3s ease !important;
        font-family: -apple-system, system-ui, sans-serif !important;
      }
      .scamspot-notification-dismiss {
        background: rgba(255, 255, 255, 0.15) !important;
        color: #fff !important;
        border: none !important;
        padding: 4px 12px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        font-family: -apple-system, system-ui, sans-serif !important;
      }
      .scamspot-notification-dismiss:hover {
        background: rgba(255, 255, 255, 0.25) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // --- Platform Detection ---

  function detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes("mail.google.com")) return "gmail";
    if (hostname.includes("web.whatsapp.com")) return "whatsapp";
    if (hostname.includes("web.telegram.org")) return "telegram";
    if (hostname.includes("instagram.com")) return "instagram";
    if (hostname.includes("web.snapchat.com")) return "snapchat";
    if (hostname.includes("messenger.com")) return "messenger";
    if (hostname === "localhost" || hostname === "127.0.0.1") return "demo";
    return "unknown";
  }

  const PLATFORM_CONTEXT_SELECTORS = {
    gmail: ["div[data-message-id]", "div.gs", "div.ii", "tr.zA", "div[role='listitem']"],
    whatsapp: ["div[data-id]", "div.message-in", "div.message-out", "div[role='row']"],
    telegram: [".message", "[data-message-id]", "div[role='listitem']", ".bubble"],
    instagram: ["div[role='row']", "div[role='listitem']", "article"],
    snapchat: ["[data-testid*='chat']", "[data-testid*='message']", "div[role='listitem']"],
    messenger: ["div[role='row']", "div[role='gridcell']", "div[data-testid*='message']"],
    demo: [".message", ".section"],
    unknown: ["article", "tr", "div[role='listitem']", "div[data-message-id]"]
  };

  function findPlatformContext(link, platform) {
    const selectors = PLATFORM_CONTEXT_SELECTORS[platform] || PLATFORM_CONTEXT_SELECTORS.unknown;
    for (const selector of selectors) {
      const container = link.closest(selector);
      if (container?.innerText) return container.innerText.trim().slice(0, 1200);
    }
    return (link.parentElement?.innerText || "").trim().slice(0, 1200);
  }

  // --- Cache (in-memory + chrome.storage.local) ---

  async function loadCache() {
    try {
      const result = await chrome.storage.local.get(["scamspot_cache", "scamspot_whitelist", "scamspot_stats"]);
      if (result.scamspot_cache) {
        const now = Date.now();
        for (const [url, entry] of Object.entries(result.scamspot_cache)) {
          const ttl = entry.isRisky ? CACHE_TTL_RISKY : CACHE_TTL_SAFE;
          if (now - entry.timestamp < ttl) verdictCache.set(url, entry);
        }
      }
      if (result.scamspot_whitelist) {
        result.scamspot_whitelist.forEach(url => whitelist.add(url));
      }
      if (result.scamspot_stats) stats = result.scamspot_stats;
    } catch (e) { /* storage may not be available in all contexts */ }
  }

  function persistState() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      chrome.storage.local.set({
        scamspot_cache: Object.fromEntries(verdictCache),
        scamspot_whitelist: [...whitelist],
        scamspot_stats: stats
      });
    }, 500);
  }

  // --- URL Risk Analysis ---

  function analyzeURLRisk(url) {
    try {
      const urlObj = new URL(url);
      let score = 0;
      const reasons = [];

      const suspiciousTLDs = [".xyz", ".top", ".work", ".click", ".link", ".download", ".stream", ".review"];
      if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
        score += 30;
        reasons.push("Suspicious domain extension");
      }

      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(urlObj.hostname)) {
        score += 40;
        reasons.push("Direct IP address instead of domain");
      }

      if (urlObj.hostname.split(".").length > 4) {
        score += 25;
        reasons.push("Excessive subdomains");
      }

      const suspiciousKeywords = [
        "verify", "account", "suspended", "urgent", "secure", "update",
        "login", "signin", "banking", "paypal", "ebay", "amazon",
        "password", "credential", "confirm", "billing"
      ];
      const urlLower = url.toLowerCase();
      const foundKeywords = suspiciousKeywords.filter(kw => urlLower.includes(kw));
      if (foundKeywords.length > 0) {
        score += foundKeywords.length * 15;
        reasons.push("Contains suspicious keywords: " + foundKeywords.join(", "));
      }

      const brands = ["google", "facebook", "microsoft", "apple", "amazon", "paypal", "netflix", "chase", "wellsfargo", "bankofamerica"];
      const hostLower = urlObj.hostname.toLowerCase();
      const realDomains = ["google.com", "facebook.com", "microsoft.com", "apple.com", "amazon.com", "paypal.com", "netflix.com", "chase.com", "wellsfargo.com", "bankofamerica.com"];
      const isRealBrandDomain = realDomains.some(d => hostLower === d || hostLower.endsWith("." + d));
      if (!isRealBrandDomain) {
        const normalized = hostLower.replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/5/g, "s").replace(/\$/g, "s");
        if (brands.some(brand => normalized.includes(brand))) {
          score += 50;
          reasons.push("Possible brand impersonation");
        }
      }

      const shorteners = ["bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd"];
      if (shorteners.some(s => urlObj.hostname.includes(s))) {
        score += 20;
        reasons.push("URL shortener (destination hidden)");
      }

      if (/[Ѐ-ӿ]/.test(urlObj.hostname)) {
        score += 60;
        reasons.push("Contains lookalike characters (homograph attack)");
      }

      if ((urlObj.hostname.match(/-/g) || []).length > 3) {
        score += 20;
        reasons.push("Excessive hyphens in domain");
      }

      if (url.length > 200) {
        score += 15;
        reasons.push("Unusually long URL");
      }

      if (urlObj.protocol === "http:" && suspiciousKeywords.some(kw => urlLower.includes(kw))) {
        score += 30;
        reasons.push("Insecure HTTP for sensitive page");
      }

      return { score: Math.min(score, 100), isRisky: score >= 50, reasons };
    } catch {
      return { score: 0, isRisky: false, reasons: [] };
    }
  }

  // --- Backend ---

  async function checkBackendAvailability() {
    try {
      const response = await fetch(BACKEND_URL + "/health", { signal: AbortSignal.timeout(2000) });
      backendAvailable = response.ok;
    } catch {
      backendAvailable = false;
    }
  }

  async function analyzeWithBackend(links) {
    try {
      const response = await fetch(BACKEND_URL + "/validate-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ urls: links })
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.highRiskUrls)) {
        return new Map(data.highRiskUrls.map(item => [item.url, {
          score: item.score || 100,
          isRisky: true,
          reasons: item.reasons?.length > 0 ? item.reasons : ["Flagged by server analysis"]
        }]));
      }
    } catch {
      backendAvailable = false;
    }
    return null;
  }

  // --- Core Scan ---

  async function scanPage(fullRescan) {
    const platform = detectPlatform();
    const linkElements = document.querySelectorAll("a");
    const linkMap = new Map();

    linkElements.forEach(el => {
      if (!el.href?.startsWith("http")) return;
      if (!fullRescan && processedLinks.has(el)) return;
      if (!linkMap.has(el.href)) linkMap.set(el.href, []);
      linkMap.get(el.href).push(el);
    });

    if (linkMap.size === 0) {
      stats = { ...stats, lastScanTime: Date.now(), platform };
      persistState();
      return;
    }

    const uncached = [];

    for (const [url, elements] of linkMap) {
      if (whitelist.has(url)) {
        elements.forEach(el => processedLinks.add(el));
        continue;
      }

      if (fullRescan) {
        const cached = verdictCache.get(url);
        if (cached && cached.source === "backend") {
          if (cached.isRisky) elements.forEach(el => flagLink(el, cached));
          elements.forEach(el => processedLinks.add(el));
          continue;
        }
      } else {
        const cached = verdictCache.get(url);
        if (cached) {
          const ttl = cached.isRisky ? CACHE_TTL_RISKY : CACHE_TTL_SAFE;
          if (Date.now() - cached.timestamp < ttl) {
            if (cached.isRisky) elements.forEach(el => flagLink(el, cached));
            elements.forEach(el => processedLinks.add(el));
            continue;
          }
        }
      }

      uncached.push({
        url,
        text: (elements[0].innerText || elements[0].getAttribute("aria-label") || "").trim().slice(0, 500),
        context: findPlatformContext(elements[0], platform),
        platform
      });
    }

    if (uncached.length === 0) {
      stats = { ...stats, lastScanTime: Date.now(), platform };
      persistState();
      return;
    }

    let backendResults = null;
    if (backendAvailable) backendResults = await analyzeWithBackend(uncached);

    let flaggedCount = 0;
    const newFlagged = [];

    for (const link of uncached) {
      let verdict;
      if (backendResults?.has(link.url)) {
        verdict = backendResults.get(link.url);
        verdict.source = "backend";
      } else {
        verdict = analyzeURLRisk(link.url);
        verdict.source = "local";
      }
      verdict.timestamp = Date.now();
      verdictCache.set(link.url, verdict);

      const elements = linkMap.get(link.url);
      if (verdict.isRisky && elements) {
        elements.forEach(el => flagLink(el, verdict));
        flaggedCount++;
        newFlagged.push({ url: link.url, score: verdict.score, reasons: verdict.reasons });
      }
      elements?.forEach(el => processedLinks.add(el));
    }

    stats = {
      totalScanned: stats.totalScanned + uncached.length,
      totalFlagged: stats.totalFlagged + flaggedCount,
      lastScanTime: Date.now(),
      platform,
      flaggedUrls: [...(stats.flaggedUrls || []), ...newFlagged].slice(-20)
    };

    if (flaggedCount > 0) {
      showNotification("Found " + flaggedCount + " suspicious link" + (flaggedCount > 1 ? "s" : "") + " on this page");
    }

    persistState();
  }

  // --- Visual Treatment ---

  function flagLink(element, verdict) {
    if (element.classList.contains("scamspot-flagged")) return;

    element.classList.add("scamspot-flagged");
    element.setAttribute("title", "ScamSpot Risk: " + verdict.score + "% — " + verdict.reasons.join(", "));

    const badge = document.createElement("span");
    badge.className = "scamspot-badge";
    badge.textContent = "!";
    element.appendChild(badge);

    element.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      showOverlay(element.href, verdict, element);
    });
  }

  // --- Warning Overlay ---

  function showOverlay(url, verdict, linkEl) {
    document.getElementById("scamspot-overlay")?.remove();

    const scoreClass = verdict.score >= 70 ? "high" : verdict.score >= 40 ? "medium" : "low";
    const escapedUrl = url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const reasonsHtml = verdict.reasons.map(r =>
      "<li>" + r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</li>"
    ).join("");

    const overlay = document.createElement("div");
    overlay.id = "scamspot-overlay";
    overlay.className = "scamspot-overlay";
    overlay.innerHTML =
      '<div class="scamspot-modal">' +
        '<div class="scamspot-modal-header">' +
          '<span class="scamspot-modal-icon">\u{1F6E1}️</span>' +
          '<div class="scamspot-modal-score ' + scoreClass + '">' + verdict.score + '%</div>' +
          '<div class="scamspot-modal-label">Risk Score</div>' +
        '</div>' +
        '<div class="scamspot-modal-url"><code>' + escapedUrl + '</code></div>' +
        '<div class="scamspot-modal-reasons"><ul>' + reasonsHtml + '</ul></div>' +
        '<div class="scamspot-modal-actions">' +
          '<button class="scamspot-btn scamspot-btn-block" data-action="block">Go Back to Safety</button>' +
          '<button class="scamspot-btn scamspot-btn-continue" data-action="continue">Continue Anyway</button>' +
          '<button class="scamspot-btn scamspot-btn-report" data-action="report">Report False Positive</button>' +
        '</div>' +
      '</div>';

    overlay.addEventListener("click", function (e) {
      const target = e.target;
      const action = target.dataset?.action;

      if (!action && target === overlay) {
        overlay.remove();
        return;
      }

      if (action === "block") {
        overlay.remove();
      } else if (action === "continue") {
        overlay.remove();
        window.open(url, "_blank", "noopener");
      } else if (action === "report") {
        whitelist.add(url);
        verdictCache.delete(url);
        linkEl.classList.remove("scamspot-flagged");
        linkEl.querySelector(".scamspot-badge")?.remove();
        linkEl.removeAttribute("title");
        overlay.remove();
        const clone = linkEl.cloneNode(true);
        linkEl.parentNode?.replaceChild(clone, linkEl);
        persistState();
        showNotification("Reported as false positive — this link won’t be flagged again");
      }
    });

    document.body.appendChild(overlay);
  }

  // --- Notification Banner ---

  function showNotification(message) {
    document.getElementById("scamspot-notification")?.remove();
    const el = document.createElement("div");
    el.id = "scamspot-notification";
    el.className = "scamspot-notification";
    el.innerHTML =
      '<span>\u{1F6E1}️ ScamSpot: ' + message + '</span>' +
      '<button class="scamspot-notification-dismiss">Dismiss</button>';
    el.querySelector(".scamspot-notification-dismiss").addEventListener("click", () => el.remove());
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  // --- Phishing Content Detection ---

  function detectPhishingContent() {
    const phishingKeywords = [
      "verify your account", "account suspended", "urgent action required",
      "confirm your identity", "unusual activity", "click here immediately",
      "your account will be closed", "update payment information",
      "prize winner", "claim your reward", "act now",
      "suspended account", "verify identity", "security alert"
    ];
    const text = document.body.innerText.toLowerCase();
    const matches = phishingKeywords.filter(kw => text.includes(kw));
    if (matches.length >= 2) {
      showNotification("This page contains " + matches.length + " phrases commonly used in scams");
    }
  }

  // --- MutationObserver (only processes new nodes) ---

  let scanTimeout = null;
  const observer = new MutationObserver(mutations => {
    if (!mutations.some(m => m.addedNodes.length > 0)) return;
    clearTimeout(scanTimeout);
    scanTimeout = setTimeout(scanPage, SCAN_DEBOUNCE);
  });

  // --- Message Listener ---

  chrome.runtime.onMessage.addListener(message => {
    if (message.action === "CHECK_LINKS") {
      (async () => {
        await checkBackendAvailability();
        await scanPage(true);
        detectPhishingContent();
      })();
    }
  });

  // --- Init ---

  async function init() {
    injectStyles();
    await loadCache();
    await checkBackendAvailability();
    await scanPage();
    detectPhishingContent();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
