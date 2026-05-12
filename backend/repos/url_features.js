const SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".info", ".ru", ".cn", ".tk", ".ml", ".cf", ".gq", ".biz",
    ".men", ".work", ".loan", ".download", ".date", ".science", ".club", ".click",
    ".link", ".stream", ".review", ".online", ".zip", ".mov", ".country"
];

const URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly",
    "cutt.ly", "rebrand.ly", "shorturl.at", "tiny.cc", "lnkd.in"
];

const SENSITIVE_KEYWORDS = [
    "verify", "account", "suspended", "urgent", "secure", "update", "login",
    "signin", "banking", "password", "credential", "confirm", "billing", "wallet",
    "unlock", "limited", "claim", "reward", "prize", "security", "support"
];

const SUSPICIOUS_PARAMS = [
    "redirect", "url", "next", "token", "auth", "session", "password", "key",
    "callback", "continue", "return", "returnurl"
];

const OFFICIAL_BRAND_DOMAINS = {
    google: ["google.com", "gmail.com", "youtube.com"],
    facebook: ["facebook.com", "fb.com", "messenger.com"],
    microsoft: ["microsoft.com", "live.com", "outlook.com", "office.com"],
    apple: ["apple.com", "icloud.com"],
    amazon: ["amazon.com", "amazon.co.uk", "aws.amazon.com"],
    paypal: ["paypal.com", "paypalobjects.com"],
    netflix: ["netflix.com"],
    instagram: ["instagram.com"],
    whatsapp: ["whatsapp.com"],
    usps: ["usps.com"],
    fedex: ["fedex.com"],
    ups: ["ups.com"],
    chase: ["chase.com"],
    bankofamerica: ["bankofamerica.com"],
    wells: ["wellsfargo.com"]
};

const KNOWN_SAFE_DOMAINS = new Set(Object.values(OFFICIAL_BRAND_DOMAINS).flat());

function calculateEntropy(value) {
    if (!value) return 0;
    const frequencies = {};
    for (const char of value) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }

    return Object.values(frequencies).reduce((score, count) => {
        const probability = count / value.length;
        return score - probability * Math.log2(probability);
    }, 0);
}

function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, row) => [row]);
    for (let col = 1; col <= b.length; col += 1) matrix[0][col] = col;

    for (let row = 1; row <= a.length; row += 1) {
        for (let col = 1; col <= b.length; col += 1) {
            const cost = a[row - 1] === b[col - 1] ? 0 : 1;
            matrix[row][col] = Math.min(
                matrix[row - 1][col] + 1,
                matrix[row][col - 1] + 1,
                matrix[row - 1][col - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
}

function getRegistrableDomain(hostname) {
    const parts = hostname.split(".").filter(Boolean);
    if (parts.length <= 2) return hostname;
    return parts.slice(-2).join(".");
}

function getMainLabel(hostname) {
    const domain = getRegistrableDomain(hostname);
    return domain.split(".")[0] || domain;
}

function hasRawIp(hostname) {
    return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname) || /^\[[0-9a-f:]+\]$/i.test(hostname);
}

function findBrandImpersonation(hostname) {
    const registrableDomain = getRegistrableDomain(hostname);
    const mainLabel = getMainLabel(hostname).replace(/[-_]/g, "");
    const matches = [];

    for (const [brand, officialDomains] of Object.entries(OFFICIAL_BRAND_DOMAINS)) {
        const isOfficial = officialDomains.some(domain =>
            registrableDomain === domain || hostname.endsWith(`.${domain}`)
        );
        if (isOfficial) continue;

        const containsBrand = hostname.includes(brand);
        const isCloseTypo = brand.length >= 5 && levenshtein(mainLabel, brand) <= 1;

        if (containsBrand || isCloseTypo) {
            matches.push(brand);
        }
    }

    return matches;
}

function extractUrlFeatures(url) {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const query = parsed.search.toLowerCase();
    const registrableDomain = getRegistrableDomain(hostname);
    const hostnameWithoutDots = hostname.replace(/\./g, "");
    const digitCount = (hostnameWithoutDots.match(/\d/g) || []).length;
    const letterCount = (hostnameWithoutDots.match(/[a-z]/g) || []).length;
    const subdomainCount = Math.max(0, hostname.split(".").length - 2);
    const encodedChars = (url.match(/%[0-9a-f]{2}/gi) || []).length;
    const queryParams = Array.from(new URLSearchParams(parsed.search).keys()).map(key => key.toLowerCase());

    return {
        protocol: parsed.protocol,
        hostname,
        pathname,
        query,
        port: parsed.port,
        registrableDomain,
        mainLabel: getMainLabel(hostname),
        digitCount,
        digitRatio: letterCount ? digitCount / letterCount : 0,
        subdomainCount,
        encodedChars,
        queryParamCount: queryParams.length,
        suspiciousQueryParams: queryParams.filter(param => SUSPICIOUS_PARAMS.includes(param)),
        entropyScore: calculateEntropy(hostnameWithoutDots),
        hasRawIp: hasRawIp(hostname),
        hasPunycode: hostname.includes("xn--"),
        hasNonAscii: /[^\x00-\x7F]/.test(url),
        length: url.length,
        isKnownSafeDomain: KNOWN_SAFE_DOMAINS.has(registrableDomain),
        shortener: URL_SHORTENERS.find(domain => hostname === domain || hostname.endsWith(`.${domain}`)) || null,
        suspiciousTld: SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld)) || null,
        sensitiveKeywords: SENSITIVE_KEYWORDS.filter(keyword =>
            hostname.includes(keyword) || pathname.includes(keyword) || query.includes(keyword)
        ),
        brandImpersonation: findBrandImpersonation(hostname)
    };
}

function riskFromScore(score) {
    if (score >= 50) return "High";
    if (score >= 25) return "Medium";
    return "Low";
}

function analyzeUrlHeuristics(inputUrl) {
    const url = typeof inputUrl === "string" ? inputUrl : inputUrl?.url;
    const reasons = [];
    let score = 0;

    if (!url || typeof url !== "string") {
        return {
            url: url || "",
            risk: "High",
            score: 100,
            reasons: ["URL is missing or invalid"],
            features: {}
        };
    }

    try {
        const features = extractUrlFeatures(url);

        if (features.hasRawIp) {
            score += 45;
            reasons.push("Uses a raw IP address instead of a domain");
        }

        if (features.suspiciousTld) {
            score += 35;
            reasons.push(`Uses suspicious TLD ${features.suspiciousTld}`);
        }

        if (features.shortener) {
            score += 30;
            reasons.push(`Uses URL shortener ${features.shortener}`);
        }

        if (features.hasNonAscii || features.hasPunycode) {
            score += 55;
            reasons.push("Uses lookalike or punycode characters");
        }

        if (features.brandImpersonation.length > 0) {
            score += 45;
            reasons.push(`Possible brand impersonation: ${features.brandImpersonation.join(", ")}`);
        }

        if (features.subdomainCount > 3) {
            score += 25;
            reasons.push("Uses excessive subdomains");
        }

        if ((features.hostname.match(/-/g) || []).length > 3) {
            score += 20;
            reasons.push("Uses excessive hyphens in the hostname");
        }

        if (features.protocol !== "https:") {
            score += features.sensitiveKeywords.length > 0 ? 30 : 12;
            reasons.push("Does not use HTTPS");
        }

        if (features.sensitiveKeywords.length > 0) {
            const keywordScore = Math.min(features.sensitiveKeywords.length * 12, 36);
            score += keywordScore;
            reasons.push(`Contains sensitive keywords: ${features.sensitiveKeywords.slice(0, 5).join(", ")}`);
        }

        if (features.suspiciousQueryParams.length > 0) {
            score += 25;
            reasons.push(`Uses suspicious query parameters: ${features.suspiciousQueryParams.slice(0, 5).join(", ")}`);
        }

        if (features.queryParamCount > 7) {
            score += 12;
            reasons.push("Has an unusually complex query string");
        }

        if (features.encodedChars > 5) {
            score += 18;
            reasons.push("Contains heavy URL encoding");
        }

        if (features.digitCount > 4 || features.digitRatio > 0.35) {
            score += 20;
            reasons.push("Hostname contains unusual digit patterns");
        }

        if (features.entropyScore > 4.1) {
            score += 18;
            reasons.push("Hostname has high character entropy");
        }

        if (features.length > 180) {
            score += 15;
            reasons.push("URL is unusually long");
        }

        if (features.port && !["80", "443"].includes(features.port)) {
            score += 20;
            reasons.push("Uses a non-standard network port");
        }

        if (features.isKnownSafeDomain && reasons.length <= 1) {
            score = Math.max(0, score - 20);
        }

        score = Math.max(0, Math.min(100, score));

        return {
            url,
            risk: riskFromScore(score),
            score,
            reasons,
            features
        };
    } catch (error) {
        return {
            url,
            risk: "High",
            score: 100,
            reasons: [`URL parsing failed: ${error.message}`],
            features: {}
        };
    }
}

module.exports = {
    analyzeUrlHeuristics,
    calculateEntropy,
    extractUrlFeatures,
    riskFromScore
};
