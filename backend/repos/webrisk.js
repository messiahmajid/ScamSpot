const fetch = require("node-fetch");

/**
 * 🔹 Extract Key URL Features for Analysis
 */
function extractUrlFeatures(urlStr) {
    try {
        const parsedUrl = new URL(urlStr);
        const protocol = parsedUrl.protocol;
        const hostname = parsedUrl.hostname.toLowerCase();
        const pathname = parsedUrl.pathname.toLowerCase();
        const query = parsedUrl.search;
        const port = parsedUrl.port;

        // Extract subdomain & main domain
        const domainParts = hostname.split('.');
        const mainDomain = domainParts.slice(-2).join('.'); // Example: usps.com
        const subdomain = domainParts.slice(0, -2).join('.');

        // Digit analysis
        const digitCount = (hostname.match(/\d/g) || []).length;
        const letterCount = (hostname.match(/[a-z]/g) || []).length;
        const digitRatio = letterCount > 0 ? digitCount / letterCount : 0;

        // Path & Query Complexity
        const encodedChars = (urlStr.match(/%/g) || []).length;
        const queryParams = new URLSearchParams(query);
        const queryParamCount = [...queryParams.keys()].length;
        const suspiciousParams = ["token", "auth", "password", "session", "redirect", "track"];
        const hasSuspiciousParams = [...queryParams.keys()].some(param => suspiciousParams.includes(param));

        // Character entropy score (higher = more random)
        const entropyScore = calculateEntropy(hostname);

        return {
            protocol,
            hostname,
            mainDomain,
            subdomain,
            pathname,
            digitCount,
            digitRatio,
            queryLength: query.length,
            encodedChars,
            queryParamCount,
            hasSuspiciousParams,
            urlLength: urlStr.length,
            entropyScore,
            port,
        };
    } catch (error) {
        return null;
    }
}

/**
 * 🔹 Calculate Shannon Entropy (Detects Randomized Domains)
 */
function calculateEntropy(str) {
    const freqMap = {};
    for (let char of str) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }
    return Object.values(freqMap).reduce((acc, freq) => {
        const probability = freq / str.length;
        return acc - probability * Math.log2(probability);
    }, 0);
}

/**
 * 🔹 Improved Domain Trust & Reputation Score
 */
const knownSafeDomains = new Set([
    "facebook.com", "google.com", "amazon.com", "apple.com",
    "microsoft.com", "paypal.com", "instagram.com", "linkedin.com",
    "usps.com", "ups.com", "fedex.com"
]);

const suspiciousTLDs = [
    ".xyz", ".top", ".info", ".ru", ".cn", ".tk", ".ml", ".cf", ".gq", ".biz",
    ".men", ".work", ".loan", ".download", ".date", ".science", ".club"
];

const freeHostingDomains = [".github.io", ".netlify.app", ".herokuapp.com"];

function getDomainTrustScore(mainDomain) {
    if (knownSafeDomains.has(mainDomain)) return 0.1;
    if (mainDomain.endsWith(".gov") || mainDomain.endsWith(".edu")) return 0.2;
    if (mainDomain.endsWith(".org") && !mainDomain.includes("free")) return 0.3;
    return 1.0; // Default unknown domain risk
}

/**
 * 🔹 Improved URL Risk Classification
 */
function classifyURL(urlStr) {
    const features = extractUrlFeatures(urlStr);
    if (!features) return "High"; // If URL parsing fails, assume high risk

    let riskScore = 0;

    // **1. Protocol Check**
    if (features.protocol !== "https:") riskScore += 2;

    // **2. Domain Reputation Score**
    riskScore += getDomainTrustScore(features.mainDomain) * 3;

    // **3. Suspicious TLD Check**
    if (suspiciousTLDs.some(tld => features.hostname.endsWith(tld))) riskScore += 3;

    // **4. Free Hosting Services**
    if (freeHostingDomains.some(domain => features.hostname.endsWith(domain))) riskScore += 3;

    // **5. High Entropy (Randomized Domains)**
    if (features.entropyScore > 4.0) riskScore += 2;

    // **6. Digit Ratio & Phishing Indicators**
    if (features.digitRatio > 0.4 || features.digitCount > 3) riskScore += 2;

    // **7. Long & Obfuscated URL**
    if (features.urlLength > 200) riskScore += 2;
    if (features.encodedChars > 5) riskScore += 2;

    // **8. Query Parameter Analysis**
    if (features.hasSuspiciousParams) riskScore += 3;
    if (features.queryParamCount > 7) riskScore += 1;

    // **9. Port Check (Non-standard ports)**
    if (features.port && !["80", "443", ""].includes(features.port)) riskScore += 2;

    return riskScore >= 7 ? "High" : riskScore >= 4 ? "Medium" : "Low";
}

/**
 * 🔹 Real-Time Threat Intelligence via Google Safe Browsing
 */
async function checkGoogleSafeBrowsing(url) {
    const apiKey = "YOUR_GOOGLE_SAFE_BROWSING_API_KEY";
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const body = {
        client: {
            clientId: "your-app",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return data.matches ? "High" : "Low";
    } catch (error) {
        return "Unknown";
    }
}

/**
 * 🔹 Bulk URL Risk Assessment
 */
async function searchUris(urlObjects) {
    return await Promise.all(urlObjects.map(async (urlObj) => {
        if (!urlObj || typeof urlObj !== 'object' || !urlObj.url) {
            return { ...urlObj, risk: 'Low', error: 'Invalid URL object format' };
        }

        let risk = classifyURL(urlObj.url);
        if (risk === "Medium") {
            risk = await checkGoogleSafeBrowsing(urlObj.url);
        }

        return { ...urlObj, risk };
    }));
}

module.exports = searchUris;
