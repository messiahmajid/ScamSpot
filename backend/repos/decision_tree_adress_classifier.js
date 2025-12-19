/**
 * Enhanced Decision Tree Classifier for URL Risk Assessment
 * This version includes advanced heuristics for detecting malicious URLs.
 */

// Enhanced classifyURL function
function classifyURL(urlStr) {
    try {
        const parsedUrl = new URL(urlStr);
        const protocol = parsedUrl.protocol;
        const hostname = parsedUrl.hostname.toLowerCase();
        const pathname = parsedUrl.pathname.toLowerCase();
        const query = parsedUrl.search;
        const port = parsedUrl.port;

        // 1. Protocol Check
        if (protocol !== "https:") return "High";

        // 2. Suspicious TLDs (expanded list)
        const suspiciousTLDs = [
            ".xyz", ".online", ".top", ".info", ".club", ".ru", ".cn",
            ".tk", ".ml", ".ga", ".cf", ".gq", ".biz", ".men", ".work"
        ];
        if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) return "High";

        // 3. Suspicious Keywords (expanded list with context analysis)
        const suspiciousKeywords = [
            "phish", "scam", "fraud", "hijack", "alert", "verify",
            "confirm", "bank", "paypal", "login", "secure", "update"
        ];
        const keywordInURL = suspiciousKeywords.some(kw =>
            hostname.includes(kw) || pathname.includes(kw)
        );
        if (keywordInURL) return "High";

        // 4. Advanced Digit Analysis
        const hostWithoutTld = hostname.split('.').slice(0, -1).join('');
        const digitCount = (hostWithoutTld.match(/\d/g) || []).length;
        const letterCount = (hostWithoutTld.match(/[a-z]/g) || []).length;
        if (digitCount > 3 || (digitCount > 1 && digitCount/letterCount > 0.3)) {
            return "High";
        }

        // 5. IP Address Check (IPv4 and IPv6)
        const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^[0-9a-fA-F:]+$/;
        if (ipv4Regex.test(hostname) || ipv6Regex.test(hostname)) return "High";

        // 6. URL Structure Analysis
        const urlLength = urlStr.length;
        const encodedChars = (urlStr.match(/%/g) || []).length;
        if (urlLength > 120 || (encodedChars > 3 && encodedChars/urlLength > 0.1)) {
            return "High";
        }

        // 7. Subdomain Analysis
        const domainParts = hostname.split('.');
        const subdomainCount = domainParts.length - 2; // Subtract domain and TLD
        if (subdomainCount > 2 || (subdomainCount > 0 && domainParts.some(part => {
            // Check for suspicious subdomain patterns
            return part.length > 15 || (part.match(/-/g) || []).length > 2;
        }))) {
            return "High";
        }

        // 8. Query String Analysis
        if (query) {
            const queryParams = new URLSearchParams(query);
            const suspiciousParams = ['redirect', 'token', 'auth', 'key', 'session'];
            if (query.length > 75 ||
                [...queryParams.keys()].some(param => suspiciousParams.includes(param)) ||
                (query.match(/=/g) || []).length > 5) {
                return "High";
            }
        }

        // 9. Port Analysis
        if (port && ![80, 443, ''].includes(port)) return "High";

        // 10. Obfuscation Checks
        if (hostname.includes('@') ||
            pathname.includes('../') ||
            (hostname.match(/[^a-z0-9.-]/) || []).length > 2) {
            return "High";
        }

        // 11. Free Hosting Service Check
        const freeHostingDomains = [".github.io", ".netlify.app", ".herokuapp.com"];
        if (freeHostingDomains.some(domain => hostname.endsWith(domain))) {
            return "High";
        }

    } catch (error) {
        return "High";
    }

    return "Low";
}

/**
 * searchUris Function
 * Takes an array of URL objects and returns the same array with a risk field added.
 *
 * @param {Array<Object>} urlObjects - Array of objects with a `url` property.
 * @returns {Promise<Array<Object>>} - Resolves to the array with risk classifications.
 */
async function searchUris(urlObjects) {
    if (!Array.isArray(urlObjects)) {
        throw new Error('Input must be an array of URL objects');
    }

    const results = urlObjects.map(urlObj => {
        if (!urlObj || typeof urlObj !== 'object' || !urlObj.url) {
            console.error('Invalid URL object:', urlObj);
            return { ...urlObj, risk: 'Low', error: 'Invalid URL object format' };
        }

        const risk = classifyURL(urlObj.url);
        return { ...urlObj, risk };
    });

    return results;
}

// Export the searchUris function
module.exports = searchUris;