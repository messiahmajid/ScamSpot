const BadLink = require('../models/bad_links');
const searchUris = require('../repos/webrisk');
const UrlAnalyzer = require('../repos/url_analysis');

exports.validateUrl = async (req, res) => {
    try {
        const userId = req.session?.userId || 1; // Use session or default

        const urls = req.body.urls;
        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ success: false, message: "Expected an array of URL objects." });
        }

        // Extract the list of URLs from the request.
        const currentUrls = urls.map(urlObj => urlObj.url);
        let highRiskUrls = [];

        // Check if MongoDB is available
        const mongoAvailable = BadLink.db && BadLink.db.readyState === 1;

        // Step 1: Query the WebRisk API if API key available
        if (process.env.GOOGLE_SAFE_BROWSING_API_KEY) {
            try {
                const webRiskResults = await searchUris(urls);
                const webRiskHighRisk = webRiskResults.filter(urlObj => urlObj.risk === "High");

                if (webRiskHighRisk.length > 0) {
                    highRiskUrls.push(...webRiskHighRisk);

                    // Add/update high-risk URLs in MongoDB if available
                    if (mongoAvailable) {
                        for (const highRisk of webRiskHighRisk) {
                            try {
                                const existingEntry = await BadLink.findOne({
                                    "badLinks": { $elemMatch: { userId, url: highRisk.url, risk: "High" } }
                                });

                                if (existingEntry) {
                                    await BadLink.updateOne(
                                        { "badLinks": { $elemMatch: { userId, url: highRisk.url, risk: "High" } } },
                                        { $inc: { "badLinks.$.frequency": 1 } }
                                    );
                                } else {
                                    await BadLink.updateOne(
                                        {},
                                        { $push: { badLinks: { url: highRisk.url, risk: "High", frequency: 1, userId } } },
                                        { upsert: true }
                                    );
                                }
                            } catch (dbError) {
                                console.warn('MongoDB write failed:', dbError.message);
                            }
                        }
                    }
                }
            } catch (apiError) {
                console.warn('WebRisk API failed:', apiError.message);
            }
        }

        // Step 2: Check BadLink table if MongoDB available
        if (mongoAvailable && highRiskUrls.length === 0) {
            try {
                const badLinkDoc = await BadLink.findOne({
                    "badLinks": { $elemMatch: { userId, risk: "High", url: { $in: currentUrls } } }
                });

                if (badLinkDoc) {
                    const highRiskFromDB = badLinkDoc.badLinks.filter(entry =>
                        entry.userId === userId && entry.risk === "High" && currentUrls.includes(entry.url)
                    );

                    if (highRiskFromDB.length > 0) {
                        highRiskUrls.push(...highRiskFromDB);
                    }
                }
            } catch (dbError) {
                console.warn('MongoDB read failed:', dbError.message);
            }
        }

        // Step 3: Use LLM-based URL analysis if OpenAI available and no risks found yet
        if (highRiskUrls.length === 0 && process.env.OPENAI) {
            try {
                const analyzer = new UrlAnalyzer();
                const llmResults = await analyzer.analyzeURLs(urls);
                const highRiskLLM = Array.isArray(llmResults)
                    ? llmResults.filter(item => item.risk_classification === "High")
                    : [];

                if (highRiskLLM.length > 0) {
                    highRiskUrls.push(...highRiskLLM);

                    // Record high-risk URLs in MongoDB if available
                    if (mongoAvailable) {
                        for (const highRisk of highRiskLLM) {
                            try {
                                const existingEntryLLM = await BadLink.findOne({
                                    "badLinks": { $elemMatch: { userId, url: highRisk.url, risk: "High" } }
                                });

                                if (existingEntryLLM) {
                                    await BadLink.updateOne(
                                        { "badLinks": { $elemMatch: { userId, url: highRisk.url, risk: "High" } } },
                                        { $inc: { "badLinks.$.frequency": 1 } }
                                    );
                                } else {
                                    await BadLink.updateOne(
                                        {},
                                        { $push: { badLinks: { url: highRisk.url, risk: "High", frequency: 1, userId } } },
                                        { upsert: true }
                                    );
                                }
                            } catch (dbError) {
                                console.warn('MongoDB write failed:', dbError.message);
                            }
                        }
                    }
                }
            } catch (llmError) {
                console.warn('LLM analysis failed:', llmError.message);
            }
        }

        // Return all high-risk URLs found
        // Note: If no API keys are configured, this will return an empty array
        // The extension's standalone mode will handle detection client-side
        return res.status(200).json({
            success: true,
            highRiskUrls: highRiskUrls,
            fallbackToClient: highRiskUrls.length === 0 && !process.env.OPENAI && !process.env.GOOGLE_SAFE_BROWSING_API_KEY
        });

    } catch (error) {
        console.error("❌ Error in validateUrl:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
};
