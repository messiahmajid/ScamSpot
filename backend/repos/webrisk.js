const { analyzeUrlHeuristics } = require("./url_features");

async function searchUris(urlObjects) {
    if (!Array.isArray(urlObjects)) {
        throw new Error("Input must be an array of URL objects");
    }

    return urlObjects.map(urlObj => {
        if (!urlObj || typeof urlObj !== "object" || !urlObj.url) {
            return { ...urlObj, risk: "High", score: 100, error: "Invalid URL object format" };
        }

        const result = analyzeUrlHeuristics(urlObj.url);
        return {
            ...urlObj,
            risk: result.risk,
            score: result.score,
            reasons: result.reasons
        };
    });
}

module.exports = searchUris;
