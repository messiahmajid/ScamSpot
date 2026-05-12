const { runOpenAiUrlDetector, normalizeUrlObjects } = require("../services/urlDetectionServices");

class URLAnalyzer {
    async analyzeURLs(urls, options = {}) {
        try {
            if (!Array.isArray(urls)) {
                throw new Error("Input must be an array of URL objects");
            }

            const controller = new AbortController();
            const timeoutMs = options.timeoutMs || Number(process.env.DETECTION_SERVICE_TIMEOUT_MS || 3500);
            const timer = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const findings = await runOpenAiUrlDetector(normalizeUrlObjects(urls), controller.signal);
                return findings.map(item => ({
                    url: item.url,
                    risk_classification: item.risk,
                    score: item.score,
                    reasons: item.reasons
                }));
            } finally {
                clearTimeout(timer);
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            };
        }
    }
}

module.exports = URLAnalyzer;
