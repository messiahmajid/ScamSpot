// ✅ Standalone Content Script - Works without backend!
if (!window.__SCAMSTOP_CONTENT_LOADED__) {
    window.__SCAMSTOP_CONTENT_LOADED__ = true;

    console.log("📌 ScamStop Content Script Loaded (Standalone Mode).");

    // Configuration
    const BACKEND_URL = "http://localhost:3000";
    let backendAvailable = false;

    // Check if backend is available
    async function checkBackendAvailability() {
        try {
            const response = await fetch(`${BACKEND_URL}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(2000) // 2 second timeout
            });
            backendAvailable = response.ok;
            if (backendAvailable) {
                console.log("✅ Backend detected - using advanced analysis");
            }
        } catch (error) {
            backendAvailable = false;
            console.log("⚠️ No backend detected - using standalone detection");
        }
    }

    // Client-side URL risk analysis (no API needed!)
    function analyzeURLRisk(url) {
        try {
            const urlObj = new URL(url);
            let riskScore = 0;
            let reasons = [];

            // Check 1: Suspicious TLDs
            const suspiciousTLDs = ['.xyz', '.top', '.work', '.click', '.link', '.download', '.stream', '.review'];
            if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
                riskScore += 30;
                reasons.push('Suspicious domain extension');
            }

            // Check 2: IP address instead of domain
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(urlObj.hostname)) {
                riskScore += 40;
                reasons.push('Direct IP address (unusual)');
            }

            // Check 3: Excessive subdomains
            const subdomains = urlObj.hostname.split('.');
            if (subdomains.length > 4) {
                riskScore += 25;
                reasons.push('Too many subdomains');
            }

            // Check 4: Suspicious keywords in URL
            const suspiciousKeywords = [
                'verify', 'account', 'suspended', 'urgent', 'secure', 'update',
                'login', 'signin', 'banking', 'paypal', 'ebay', 'amazon',
                'password', 'credential', 'confirm', 'billing'
            ];
            const urlLower = url.toLowerCase();
            const foundKeywords = suspiciousKeywords.filter(kw => urlLower.includes(kw));
            if (foundKeywords.length > 0) {
                riskScore += foundKeywords.length * 15;
                reasons.push(`Contains suspicious words: ${foundKeywords.join(', ')}`);
            }

            // Check 5: Look for brand impersonation
            const brands = ['google', 'facebook', 'microsoft', 'apple', 'amazon', 'paypal', 'netflix'];
            const hasBrandInSubdomain = brands.some(brand => {
                const parts = urlObj.hostname.split('.');
                // Remove the actual domain
                const mainDomain = parts.slice(-2).join('.');
                const subdomainPart = parts.slice(0, -2).join('.');
                return subdomainPart.includes(brand) && !mainDomain.includes(brand);
            });
            if (hasBrandInSubdomain) {
                riskScore += 50;
                reasons.push('Possible brand impersonation in subdomain');
            }

            // Check 6: URL shorteners (could hide malicious links)
            const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd'];
            if (shorteners.some(s => urlObj.hostname.includes(s))) {
                riskScore += 20;
                reasons.push('URL shortener (destination hidden)');
            }

            // Check 7: Homograph attacks (lookalike characters)
            if (/[а-яА-Я]/.test(urlObj.hostname)) { // Cyrillic characters
                riskScore += 60;
                reasons.push('Contains lookalike characters (homograph attack)');
            }

            // Check 8: Excessive hyphens
            if ((urlObj.hostname.match(/-/g) || []).length > 3) {
                riskScore += 20;
                reasons.push('Excessive hyphens in domain');
            }

            // Check 9: Very long URLs (often used to hide malicious content)
            if (url.length > 200) {
                riskScore += 15;
                reasons.push('Unusually long URL');
            }

            // Check 10: Mismatched protocol (http for login pages)
            if (urlObj.protocol === 'http:' && suspiciousKeywords.some(kw => urlLower.includes(kw))) {
                riskScore += 30;
                reasons.push('Insecure HTTP for sensitive page');
            }

            return {
                score: Math.min(riskScore, 100),
                isRisky: riskScore >= 50,
                reasons: reasons
            };
        } catch (error) {
            return { score: 0, isRisky: false, reasons: [] };
        }
    }

    // Validate links using backend OR standalone analysis
    async function validateLinks() {
        console.log("🔍 Running validateLinks()...");

        // Extract all links
        const links = Array.from(document.querySelectorAll("a"))
            .map(a => a.href)
            .filter(url => url.startsWith("http"));

        if (links.length === 0) {
            console.warn("⚠️ No links found on this page.");
            return;
        }

        console.log(`🔗 Found ${links.length} links to analyze`);

        // Try backend first, fallback to standalone
        if (backendAvailable) {
            await validateLinksWithBackend(links);
        } else {
            validateLinksStandalone(links);
        }
    }

    // Backend validation (advanced AI analysis)
    async function validateLinksWithBackend(links) {
        const urlData = links.map(url => ({ url }));

        try {
            const response = await fetch(`${BACKEND_URL}/validate-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ urls: urlData }),
            });

            const data = await response.json();
            console.log("🛡️ Backend API Response:", data);

            if (data.success && Array.isArray(data.highRiskUrls)) {
                highlightMaliciousLinks(data.highRiskUrls.map(item => ({
                    url: item.url,
                    reason: 'AI-detected threat',
                    score: 100
                })));
            }
        } catch (error) {
            console.error("❌ Backend validation failed, using standalone:", error);
            backendAvailable = false;
            validateLinksStandalone(links);
        }
    }

    // Standalone validation (client-side heuristics)
    function validateLinksStandalone(links) {
        console.log("🔬 Using standalone analysis (no backend needed)");

        const riskyLinks = links
            .map(url => {
                const analysis = analyzeURLRisk(url);
                return { url, ...analysis };
            })
            .filter(item => item.isRisky);

        if (riskyLinks.length > 0) {
            console.log(`⚠️ Found ${riskyLinks.length} risky links:`, riskyLinks);
            highlightMaliciousLinks(riskyLinks);
        } else {
            console.log("✅ No suspicious links detected");
        }
    }

    // Highlight risky links on the page
    function highlightMaliciousLinks(riskyLinks) {
        const allLinks = document.querySelectorAll("a");
        let highlightCount = 0;

        riskyLinks.forEach(({ url, reasons, score }) => {
            allLinks.forEach(link => {
                if (link.href === url) {
                    // Style the link
                    link.style.border = "3px solid red";
                    link.style.backgroundColor = "#ffe6e6";
                    link.style.color = "#cc0000";
                    link.style.fontWeight = "bold";
                    link.style.padding = "2px 4px";
                    link.style.borderRadius = "3px";

                    // Add warning tooltip
                    const reasonText = reasons && reasons.length > 0
                        ? reasons.join('; ')
                        : 'Potentially malicious link';
                    link.setAttribute("title", `⚠️ RISK ${score}%: ${reasonText}`);

                    // Add warning icon
                    if (!link.querySelector('.scamspot-warning')) {
                        const warningIcon = document.createElement("span");
                        warningIcon.className = "scamspot-warning";
                        warningIcon.innerHTML = " ⚠️";
                        warningIcon.style.color = "red";
                        warningIcon.style.fontSize = "16px";
                        warningIcon.style.marginLeft = "5px";
                        link.appendChild(warningIcon);
                    }

                    // Add click warning
                    link.addEventListener('click', function(e) {
                        const confirmClick = confirm(
                            `⚠️ WARNING: This link may be dangerous!\n\n` +
                            `Risk Level: ${score}%\n` +
                            `Reasons:\n${reasonText}\n\n` +
                            `Are you sure you want to continue?`
                        );
                        if (!confirmClick) {
                            e.preventDefault();
                        }
                    }, { once: true });

                    highlightCount++;
                }
            });
        });

        if (highlightCount > 0) {
            console.log(`🚨 Highlighted ${highlightCount} dangerous links`);

            // Show notification
            showNotification(`⚠️ ScamSpot: Found ${highlightCount} suspicious link${highlightCount > 1 ? 's' : ''} on this page!`);
        }
    }

    // Show notification banner
    function showNotification(message) {
        // Remove existing notification
        const existing = document.getElementById('scamspot-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'scamspot-notification';
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            z-index: 999999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
        `;
        notification.innerHTML = `
            ${message}
            <button onclick="this.parentElement.remove()" style="
                margin-left: 20px;
                background: white;
                color: #cc0000;
                border: none;
                padding: 5px 15px;
                border-radius: 3px;
                cursor: pointer;
                font-weight: bold;
            ">Dismiss</button>
        `;

        document.body.insertBefore(notification, document.body.firstChild);

        // Auto-dismiss after 10 seconds
        setTimeout(() => notification.remove(), 10000);
    }

    // Detect phishing content on the page
    function detectPhishingContent() {
        const phishingKeywords = [
            'verify your account', 'account suspended', 'urgent action required',
            'confirm your identity', 'unusual activity', 'click here immediately',
            'your account will be closed', 'update payment information',
            'prize winner', 'claim your reward', 'act now', 'limited time',
            'suspended account', 'verify identity', 'security alert'
        ];

        const text = document.body.innerText.toLowerCase();
        const matches = phishingKeywords.filter(keyword => text.includes(keyword.toLowerCase()));

        if (matches.length > 0) {
            console.warn(`⚠️ Detected ${matches.length} phishing keywords:`, matches);
            showNotification(`⚠️ Warning: This page contains ${matches.length} suspicious phrase${matches.length > 1 ? 's' : ''} commonly used in scams!`);
        }

        return { matches, count: matches.length };
    }

    // Create a MutationObserver to detect DOM changes
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
            // Debounce: Only revalidate after 1 second of no changes
            clearTimeout(window.__scamstopTimer);
            window.__scamstopTimer = setTimeout(() => {
                validateLinks();
            }, 1000);
        }
    });

    // Initialize
    async function init() {
        await checkBackendAvailability();

        // Run initial scan
        validateLinks();
        detectPhishingContent();

        // Start observing DOM changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log("✅ ScamSpot initialized successfully!");
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "CHECK_LINKS") {
            validateLinks();
            detectPhishingContent();
        }
    });

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}
