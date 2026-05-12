const { analyzeUrlHeuristics, riskFromScore } = require("../repos/url_features");
const { runService } = require("./resilience");

const DEFAULT_TIMEOUT_MS = Number(process.env.DETECTION_SERVICE_TIMEOUT_MS || 3500);
const DEFAULT_RETRIES = Number(process.env.DETECTION_SERVICE_RETRIES || 1);

function normalizeUrlObjects(urls) {
    return urls.map((item, index) => {
        if (typeof item === "string") return { id: String(index), url: item };
        return {
            id: item.id || String(index),
            url: item.url,
            text: item.text || item.label || "",
            context: item.context || "",
            platform: item.platform || "unknown"
        };
    });
}

function createFinding(service, item, risk, score, reasons = [], metadata = {}) {
    return {
        service,
        id: item.id,
        url: item.url,
        platform: item.platform,
        risk,
        score: Math.max(0, Math.min(100, Number(score) || 0)),
        reasons: Array.isArray(reasons) ? reasons.filter(Boolean) : [String(reasons)],
        metadata
    };
}

async function runHeuristicDetector(urls) {
    return urls.map(item => {
        const result = analyzeUrlHeuristics(item.url);
        return createFinding("urlHeuristics", item, result.risk, result.score, result.reasons, {
            features: result.features
        });
    });
}

async function runGoogleSafeBrowsingDetector(urls, signal) {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (!apiKey) return [];

    const response = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                client: {
                    clientId: "scamspot",
                    clientVersion: "1.0.0"
                },
                threatInfo: {
                    threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: urls.map(item => ({ url: item.url }))
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Google Safe Browsing returned ${response.status}`);
    }

    const payload = await response.json();
    const matchedUrls = new Set((payload.matches || []).map(match => match.threat?.url).filter(Boolean));

    return urls.map(item => {
        const matched = matchedUrls.has(item.url);
        return createFinding(
            "googleSafeBrowsing",
            item,
            matched ? "High" : "Low",
            matched ? 100 : 0,
            matched ? ["Google Safe Browsing matched this URL"] : [],
            { matched }
        );
    });
}

function parseJsonContent(content) {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    return JSON.parse(fenced ? fenced[1] : content);
}

async function runOpenAiUrlDetector(urls, signal) {
    const apiKey = process.env.OPENAI;
    if (!apiKey) return [];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        signal,
        body: JSON.stringify({
            model: process.env.OPENAI_URL_MODEL || "gpt-4o",
            temperature: 0.1,
            max_tokens: 1800,
            messages: [
                {
                    role: "system",
                    content: [
                        "You are a phishing URL detection service.",
                        "Return only JSON with this shape:",
                        "{\"results\":[{\"url\":\"...\",\"risk\":\"High|Medium|Low\",\"score\":0-100,\"reasons\":[\"...\"]}]}",
                        "Use High for likely phishing, credential theft, brand impersonation, malware, or deceptive redirects.",
                        "Use Medium for suspicious but inconclusive links. Use Low only when no suspicious signals are present."
                    ].join(" ")
                },
                {
                    role: "user",
                    content: JSON.stringify(urls.map(item => ({
                        url: item.url,
                        text: item.text,
                        context: item.context,
                        platform: item.platform
                    })))
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI returned ${response.status}`);
    }

    const payload = await response.json();
    const parsed = parseJsonContent(payload.choices?.[0]?.message?.content || "{}");
    const findings = Array.isArray(parsed) ? parsed : parsed.results;
    if (!Array.isArray(findings)) {
        throw new Error("OpenAI response did not contain a results array");
    }

    const byUrl = new Map(urls.map(item => [item.url, item]));
    return findings
        .filter(item => byUrl.has(item.url))
        .map(item => {
            const original = byUrl.get(item.url);
            const score = item.score ?? (item.risk === "High" ? 85 : item.risk === "Medium" ? 45 : 0);
            return createFinding(
                "openaiUrlAnalysis",
                original,
                ["High", "Medium", "Low"].includes(item.risk) ? item.risk : riskFromScore(score),
                score,
                item.reasons || []
            );
        });
}

async function runAzureTextSignalsDetector(urls, signal) {
    const endpoint = (process.env.AZUREURL || "").replace(/\/$/, "");
    const key = process.env.AZUREKEY;
    if (!endpoint || !key) return [];

    const documents = urls.map((item, index) => ({
        id: String(index),
        language: "en",
        text: [item.text, item.context, item.url].filter(Boolean).join(" ").slice(0, 5000)
    }));

    const response = await fetch(`${endpoint}/text/analytics/v3.1/sentiment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": key
        },
        signal,
        body: JSON.stringify({ documents })
    });

    if (!response.ok) {
        throw new Error(`Azure Text Analytics returned ${response.status}`);
    }

    const payload = await response.json();
    const docsById = new Map((payload.documents || []).map(doc => [doc.id, doc]));

    return urls.map((item, index) => {
        const doc = docsById.get(String(index));
        const text = `${item.text || ""} ${item.context || ""}`.toLowerCase();
        const urgencySignals = [
            "urgent", "immediately", "verify", "suspended", "password", "wire transfer",
            "gift card", "claim", "reward", "limited time", "security alert"
        ].filter(keyword => text.includes(keyword));

        const negative = doc?.confidenceScores?.negative || 0;
        const score = Math.min(100, urgencySignals.length * 18 + (negative > 0.7 ? 20 : 0));

        return createFinding(
            "azureTextSignals",
            item,
            riskFromScore(score),
            score,
            urgencySignals.length > 0
                ? [`Message context contains scam pressure signals: ${urgencySignals.slice(0, 5).join(", ")}`]
                : [],
            { sentiment: doc?.sentiment || "unknown", confidenceScores: doc?.confidenceScores || null }
        );
    });
}

function mergeFindings(urls, serviceResults) {
    const byUrl = new Map(urls.map(item => [item.url, {
        id: item.id,
        url: item.url,
        platform: item.platform,
        text: item.text,
        context: item.context,
        risk: "Low",
        score: 0,
        reasons: [],
        services: {}
    }]));

    for (const serviceResult of serviceResults) {
        if (serviceResult.status !== "fulfilled") continue;

        for (const finding of serviceResult.results) {
            if (!byUrl.has(finding.url)) continue;
            const current = byUrl.get(finding.url);
            current.services[serviceResult.name] = {
                risk: finding.risk,
                score: finding.score,
                reasons: finding.reasons,
                metadata: finding.metadata
            };

            current.score = Math.max(current.score, finding.score);
            if (finding.risk === "High") {
                current.risk = "High";
            } else if (finding.risk === "Medium" && current.risk !== "High") {
                current.risk = "Medium";
            }

            for (const reason of finding.reasons || []) {
                const labeledReason = `${serviceResult.name}: ${reason}`;
                if (!current.reasons.includes(labeledReason)) {
                    current.reasons.push(labeledReason);
                }
            }
        }
    }

    return Array.from(byUrl.values()).map(item => ({
        ...item,
        risk: item.risk === "Low" ? riskFromScore(item.score) : item.risk
    }));
}

function statusSummary(serviceResults) {
    return serviceResults.map(result => ({
        name: result.name,
        status: result.status,
        durationMs: result.durationMs,
        error: result.error
    }));
}

async function runUrlDetection(urlInput, options = {}) {
    const urls = normalizeUrlObjects(urlInput);
    const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
    const retries = options.retries ?? DEFAULT_RETRIES;

    const detectors = options.detectors || [
        {
            name: "urlHeuristics",
            enabled: true,
            timeoutMs: 500,
            retries: 0,
            execute: () => runHeuristicDetector(urls)
        },
        {
            name: "googleSafeBrowsing",
            enabled: !!process.env.GOOGLE_SAFE_BROWSING_API_KEY,
            timeoutMs,
            retries,
            execute: ({ signal }) => runGoogleSafeBrowsingDetector(urls, signal)
        },
        {
            name: "openaiUrlAnalysis",
            enabled: !!process.env.OPENAI,
            timeoutMs,
            retries,
            execute: ({ signal }) => runOpenAiUrlDetector(urls, signal)
        },
        {
            name: "azureTextSignals",
            enabled: !!(process.env.AZUREURL && process.env.AZUREKEY),
            timeoutMs,
            retries,
            execute: ({ signal }) => runAzureTextSignalsDetector(urls, signal)
        }
    ];

    const serviceResults = await Promise.all(detectors.map(detector => runService(detector)));
    const results = mergeFindings(urls, serviceResults);

    return {
        results,
        highRiskUrls: results.filter(item => item.risk === "High"),
        serviceStatuses: statusSummary(serviceResults)
    };
}

module.exports = {
    createFinding,
    mergeFindings,
    normalizeUrlObjects,
    runAzureTextSignalsDetector,
    runGoogleSafeBrowsingDetector,
    runHeuristicDetector,
    runOpenAiUrlDetector,
    runUrlDetection
};
