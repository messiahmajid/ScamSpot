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

            // Check 1: Suspicious TLDs (expanded list)
            const suspiciousTLDs = [
                '.xyz', '.top', '.work', '.click', '.link', '.download', '.stream', '.review',
                '.loan', '.win', '.bid', '.racing', '.accountant', '.science', '.party',
                '.gq', '.ml', '.cf', '.ga', '.tk', '.zip', '.mov', '.cm'
            ];
            if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
                riskScore += 35;
                reasons.push('⚠️ Suspicious domain extension (commonly used in scams)');
            }

            // Check 2: IP address instead of domain
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(urlObj.hostname)) {
                riskScore += 45;
                reasons.push('🚨 Direct IP address detected (highly unusual for legitimate sites)');
            }

            // Check 3: Excessive subdomains
            const subdomains = urlObj.hostname.split('.');
            if (subdomains.length > 4) {
                riskScore += 30;
                reasons.push('⚠️ Too many subdomains (obfuscation tactic)');
            }

            // Check 4: Suspicious keywords in URL
            const suspiciousKeywords = [
                'verify', 'account', 'suspended', 'urgent', 'secure', 'update',
                'login', 'signin', 'banking', 'paypal', 'ebay', 'amazon',
                'password', 'credential', 'confirm', 'billing', 'wallet',
                'refund', 'claim', 'prize', 'winner', 'validate', 'restore'
            ];
            const urlLower = url.toLowerCase();
            const foundKeywords = suspiciousKeywords.filter(kw => urlLower.includes(kw));
            if (foundKeywords.length >= 2) {
                riskScore += foundKeywords.length * 20;
                reasons.push(`🚨 Multiple suspicious keywords: ${foundKeywords.join(', ')}`);
            } else if (foundKeywords.length === 1) {
                riskScore += 15;
                reasons.push(`⚠️ Suspicious keyword: ${foundKeywords[0]}`);
            }

            // Check 5: Brand impersonation (improved detection)
            const brandPatterns = {
                'google': ['google.com', 'gmail.com', 'youtube.com'],
                'facebook': ['facebook.com', 'fb.com'],
                'microsoft': ['microsoft.com', 'outlook.com', 'live.com', 'office.com'],
                'apple': ['apple.com', 'icloud.com'],
                'amazon': ['amazon.com', 'aws.amazon.com'],
                'paypal': ['paypal.com'],
                'netflix': ['netflix.com'],
                'bank': ['bankofamerica.com', 'chase.com', 'wellsfargo.com', 'citibank.com']
            };

            for (const [brand, legitimateDomains] of Object.entries(brandPatterns)) {
                const hostname = urlObj.hostname.toLowerCase();
                // Check if brand name appears but not in legitimate domain
                if (hostname.includes(brand) && !legitimateDomains.some(d => hostname.endsWith(d))) {
                    riskScore += 55;
                    reasons.push(`🚨 Possible ${brand} impersonation - not official domain!`);
                    break;
                }
            }

            // Check 6: Typosquatting detection (common misspellings)
            const typosquatPatterns = [
                /g[o0]{2}gle/, /faceb[o0]{2}k/, /micr[o0]s[o0]ft/, /paypa[il]/,
                /amaz[o0]n/, /netfl[i1]x/, /app[i1]e/, /tw[i1]tter/
            ];
            if (typosquatPatterns.some(pattern => pattern.test(urlObj.hostname))) {
                riskScore += 60;
                reasons.push('🚨 Typosquatting detected - misspelled brand name!');
            }

            // Check 7: URL shorteners (could hide malicious links)
            const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly'];
            if (shorteners.some(s => urlObj.hostname.includes(s))) {
                riskScore += 25;
                reasons.push('⚠️ URL shortener (true destination hidden)');
            }

            // Check 8: Homograph attacks (lookalike characters)
            if (/[а-яА-Я]/.test(urlObj.hostname)) { // Cyrillic characters
                riskScore += 65;
                reasons.push('🚨 Homograph attack - contains lookalike characters!');
            }

            // Check 9: Excessive hyphens or underscores
            const specialChars = (urlObj.hostname.match(/[-_]/g) || []).length;
            if (specialChars > 3) {
                riskScore += 25;
                reasons.push('⚠️ Excessive hyphens/underscores in domain');
            }

            // Check 10: Very long URLs (often used to hide malicious content)
            if (url.length > 200) {
                riskScore += 20;
                reasons.push('⚠️ Unusually long URL (possible obfuscation)');
            }

            // Check 11: Mismatched protocol (http for login pages)
            if (urlObj.protocol === 'http:' && suspiciousKeywords.some(kw => urlLower.includes(kw))) {
                riskScore += 35;
                reasons.push('🚨 Insecure HTTP for sensitive page (should be HTTPS)');
            }

            // Check 12: Suspicious port numbers
            if (urlObj.port && !['80', '443', '8080', ''].includes(urlObj.port)) {
                riskScore += 20;
                reasons.push(`⚠️ Unusual port number: ${urlObj.port}`);
            }

            // Check 13: Query string manipulation (common in phishing)
            const queryParams = new URLSearchParams(urlObj.search);
            if (queryParams.has('redirect') || queryParams.has('url') || queryParams.has('next')) {
                riskScore += 15;
                reasons.push('⚠️ Contains redirect parameter (possible phishing)');
            }

            return {
                score: Math.min(riskScore, 100),
                isRisky: riskScore >= 40, // Lower threshold for better detection
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

    // Find the email container for a given element (Gmail-specific)
    function findEmailContainer(element) {
        let current = element;
        let attempts = 0;
        const maxAttempts = 15;

        while (current && current !== document.body && attempts < maxAttempts) {
            // Gmail email row selectors
            if (current.matches && (
                current.matches('tr.zA') || // Gmail inbox row
                current.matches('div[role="listitem"]') || // Gmail list item
                current.matches('div.ae4') || // Gmail email container
                current.matches('div[data-message-id]') || // Email with message ID
                current.classList.contains('gs') || // Gmail message
                current.classList.contains('ii') // Gmail message body
            )) {
                return current;
            }
            current = current.parentElement;
            attempts++;
        }
        return null;
    }

    // Mark an email container as suspicious
    function markSuspiciousEmail(emailContainer, riskyLinks) {
        if (!emailContainer || emailContainer.dataset.scamspotMarked) return;

        emailContainer.dataset.scamspotMarked = 'true';

        // Add red border and background to email
        emailContainer.style.borderLeft = '6px solid #ff0000';
        emailContainer.style.backgroundColor = '#fff0f0';
        emailContainer.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3)';

        // Create warning badge
        const warningBadge = document.createElement('div');
        warningBadge.className = 'scamspot-email-warning';
        warningBadge.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 13px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(255, 0, 0, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        const totalScore = Math.max(...riskyLinks.map(l => l.score));
        warningBadge.innerHTML = `
            <span style="font-size: 18px;">🚨</span>
            <span>SCAM ALERT ${totalScore}%</span>
        `;

        // Show details on hover
        const allReasons = riskyLinks.flatMap(l => l.reasons).join('\n• ');
        warningBadge.title = `⚠️ SUSPICIOUS EMAIL DETECTED\n\nThreats found: ${riskyLinks.length}\n\nReasons:\n• ${allReasons}`;

        // Click to show details
        warningBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            alert(
                `🚨 SCAM ALERT - This email is suspicious!\n\n` +
                `Risk Level: ${totalScore}%\n` +
                `Suspicious links found: ${riskyLinks.length}\n\n` +
                `Reasons:\n• ${allReasons}\n\n` +
                `⚠️ DO NOT click links or provide personal information!`
            );
        });

        // Position badge relative to email container
        if (emailContainer.style.position !== 'relative' && emailContainer.style.position !== 'absolute') {
            emailContainer.style.position = 'relative';
        }

        emailContainer.insertBefore(warningBadge, emailContainer.firstChild);
    }

    // Highlight risky links on the page AND mark their parent emails
    function highlightMaliciousLinks(riskyLinks) {
        const allLinks = document.querySelectorAll("a");
        let highlightCount = 0;
        const markedEmails = new Map(); // Track which emails have which risky links

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
                        e.preventDefault();
                        e.stopPropagation();
                        const confirmClick = confirm(
                            `🚨 DANGER: This link is HIGHLY SUSPICIOUS!\n\n` +
                            `Risk Level: ${score}%\n\n` +
                            `Reasons:\n${reasonText}\n\n` +
                            `This link may steal your personal information, passwords, or credit card details.\n\n` +
                            `Are you ABSOLUTELY SURE you want to continue?`
                        );
                        if (confirmClick) {
                            window.open(url, '_blank');
                        }
                    }, { once: false });

                    // Find and mark the parent email container
                    const emailContainer = findEmailContainer(link);
                    if (emailContainer) {
                        if (!markedEmails.has(emailContainer)) {
                            markedEmails.set(emailContainer, []);
                        }
                        markedEmails.get(emailContainer).push({ url, reasons, score });
                    }

                    highlightCount++;
                }
            });
        });

        // Mark all affected email containers
        markedEmails.forEach((riskyLinksInEmail, emailContainer) => {
            markSuspiciousEmail(emailContainer, riskyLinksInEmail);
        });

        if (highlightCount > 0) {
            console.log(`🚨 Highlighted ${highlightCount} dangerous links in ${markedEmails.size} emails`);

            // Show notification
            showNotification(
                `🚨 SCAM ALERT: Found ${highlightCount} suspicious link${highlightCount > 1 ? 's' : ''} ` +
                `in ${markedEmails.size} email${markedEmails.size > 1 ? 's' : ''}!`
            );
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

    // Analyze email content for scam indicators
    function analyzeEmailContent(element) {
        const text = element.innerText || element.textContent || '';
        const textLower = text.toLowerCase();
        let score = 0;
        let indicators = [];

        // Category 1: Urgency tactics
        const urgencyPhrases = [
            'urgent action required', 'immediate action', 'act now', 'limited time',
            'expires today', 'expires soon', 'within 24 hours', 'within 48 hours',
            'last chance', 'final notice', 'do not delay', 'respond immediately'
        ];
        const urgencyMatches = urgencyPhrases.filter(p => textLower.includes(p));
        if (urgencyMatches.length > 0) {
            score += urgencyMatches.length * 15;
            indicators.push(`Urgency tactics: ${urgencyMatches.join(', ')}`);
        }

        // Category 2: Account threats
        const threatPhrases = [
            'account suspended', 'account locked', 'account will be closed',
            'account has been compromised', 'unauthorized access', 'suspicious activity',
            'unusual activity', 'verify your account', 'confirm your identity',
            'restore access', 'reactivate your account'
        ];
        const threatMatches = threatPhrases.filter(p => textLower.includes(p));
        if (threatMatches.length > 0) {
            score += threatMatches.length * 20;
            indicators.push(`Account threats: ${threatMatches.join(', ')}`);
        }

        // Category 3: Prize/Money scams
        const prizePhrases = [
            'you\'ve won', 'prize winner', 'claim your reward', 'claim your prize',
            'congratulations', 'you\'re a winner', 'free money', 'cash reward',
            'inheritance', 'lottery', 'sweepstakes', 'grant awarded'
        ];
        const prizeMatches = prizePhrases.filter(p => textLower.includes(p));
        if (prizeMatches.length > 0) {
            score += prizeMatches.length * 25;
            indicators.push(`Prize scam indicators: ${prizeMatches.join(', ')}`);
        }

        // Category 4: Payment requests
        const paymentPhrases = [
            'update payment', 'payment failed', 'billing problem', 'payment method',
            'credit card expired', 'verify payment', 'update billing', 'confirm payment',
            'refund pending', 'tax refund', 'wire transfer', 'send money'
        ];
        const paymentMatches = paymentPhrases.filter(p => textLower.includes(p));
        if (paymentMatches.length > 0) {
            score += paymentMatches.length * 18;
            indicators.push(`Payment requests: ${paymentMatches.join(', ')}`);
        }

        // Category 5: Credential requests
        const credentialPhrases = [
            'verify password', 'confirm password', 'reset password', 'update password',
            'enter your password', 'provide your ssn', 'social security', 'tax id',
            'enter credentials', 'verify credentials', 'confirm login'
        ];
        const credentialMatches = credentialPhrases.filter(p => textLower.includes(p));
        if (credentialMatches.length > 0) {
            score += credentialMatches.length * 30;
            indicators.push(`Credential requests: ${credentialMatches.join(', ')}`);
        }

        // Category 6: Grammar/spelling issues (common in scams)
        const grammarIssues = [];
        if (/dear (customer|user|member|sir\/madam)/i.test(text)) {
            grammarIssues.push('Generic greeting');
            score += 10;
        }
        if (text.match(/[A-Z]{10,}/)) { // Excessive caps
            grammarIssues.push('Excessive capitalization');
            score += 15;
        }
        if (grammarIssues.length > 0) {
            indicators.push(`Grammar issues: ${grammarIssues.join(', ')}`);
        }

        // Category 7: Suspicious sender patterns (check from/reply-to)
        const emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
        const emails = text.match(emailPattern) || [];
        const suspiciousEmailPatterns = [
            /@.*\.xyz$/, /@.*\.top$/, /@.*\.click$/,
            /noreply@(?!.*\.(com|org|net))/, // noreply from unusual TLD
            /support@.*\.info$/, /admin@.*\.tk$/
        ];
        const suspiciousEmails = emails.filter(email =>
            suspiciousEmailPatterns.some(pattern => pattern.test(email.toLowerCase()))
        );
        if (suspiciousEmails.length > 0) {
            score += 25;
            indicators.push(`Suspicious sender: ${suspiciousEmails[0]}`);
        }

        return {
            score,
            indicators,
            isSuspicious: score >= 30
        };
    }

    // Detect phishing content on the page
    function detectPhishingContent() {
        const analysis = analyzeEmailContent(document.body);

        if (analysis.isSuspicious) {
            console.warn(`⚠️ Detected ${analysis.indicators.length} scam indicators (score: ${analysis.score}):`, analysis.indicators);

            // Highlight emails with suspicious content
            const emailContainers = document.querySelectorAll('tr.zA, div[role="listitem"], div.gs, div.ii');
            emailContainers.forEach(container => {
                const containerAnalysis = analyzeEmailContent(container);
                if (containerAnalysis.isSuspicious && !container.dataset.scamspotContentMarked) {
                    container.dataset.scamspotContentMarked = 'true';

                    // Add warning overlay for suspicious content
                    const contentWarning = document.createElement('div');
                    contentWarning.className = 'scamspot-content-warning';
                    contentWarning.style.cssText = `
                        background: rgba(255, 165, 0, 0.15);
                        border-top: 3px solid orange;
                        padding: 10px;
                        margin: 5px 0;
                        border-radius: 5px;
                        font-size: 12px;
                        color: #cc6600;
                        font-weight: bold;
                    `;
                    contentWarning.innerHTML = `
                        ⚠️ SUSPICIOUS CONTENT DETECTED (${containerAnalysis.score}% risk)<br>
                        <small>${containerAnalysis.indicators.slice(0, 3).join(' • ')}</small>
                    `;

                    container.insertBefore(contentWarning, container.firstChild);
                }
            });

            showNotification(
                `⚠️ SCAM WARNING: Detected ${analysis.indicators.length} suspicious phrase${analysis.indicators.length > 1 ? 's' : ''} ` +
                `commonly used in phishing emails!`
            );
        }

        return analysis;
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
