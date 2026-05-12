const BadLink = require('../models/bad_links');
const UrlScan = require('../models/url_scan');
const { runUrlDetection } = require('../services/urlDetectionServices');

function isMongoAvailable() {
    return BadLink.db && BadLink.db.readyState === 1;
}

function requireMongo(res) {
    if (isMongoAvailable()) return false;

    res.status(503).json({
        success: false,
        message: "MongoDB is not connected. Scan history and analytics are unavailable in stateless mode."
    });
    return true;
}

async function upsertHighRiskLinks(userId, highRiskUrls) {
    for (const result of highRiskUrls) {
        try {
            const existingEntry = await BadLink.findOne({
                "badLinks": { $elemMatch: { userId, url: result.url } }
            });

            if (existingEntry) {
                await BadLink.updateOne(
                    { "badLinks": { $elemMatch: { userId, url: result.url } } },
                    {
                        $set: {
                            "badLinks.$.risk": result.risk,
                            "badLinks.$.score": result.score,
                            "badLinks.$.reasons": result.reasons,
                            "badLinks.$.lastSeenAt": new Date()
                        },
                        $inc: { "badLinks.$.frequency": 1 }
                    }
                );
            } else {
                await BadLink.updateOne(
                    {},
                    {
                        $push: {
                            badLinks: {
                                url: result.url,
                                risk: result.risk,
                                score: result.score,
                                reasons: result.reasons,
                                frequency: 1,
                                userId,
                                firstSeenAt: new Date(),
                                lastSeenAt: new Date()
                            }
                        }
                    },
                    { upsert: true }
                );
            }
        } catch (dbError) {
            console.warn('MongoDB high-risk link write failed:', dbError.message);
        }
    }
}

async function persistScan({ userId, urlResults, serviceStatuses }) {
    if (!isMongoAvailable()) return;

    try {
        await UrlScan.create({
            userId,
            urls: urlResults.map(result => ({
                url: result.url,
                platform: result.platform,
                risk: result.risk,
                score: result.score,
                reasons: result.reasons,
                services: result.services
            })),
            serviceStatuses
        });
    } catch (dbError) {
        console.warn('MongoDB scan history write failed:', dbError.message);
    }

    const highRiskUrls = urlResults.filter(result => result.risk === "High");
    if (highRiskUrls.length > 0) {
        await upsertHighRiskLinks(userId, highRiskUrls);
    }
}

exports.validateUrl = async (req, res) => {
    try {
        const userId = String(req.session?.userId || 'anonymous');

        const urls = req.body.urls;
        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ success: false, message: "Expected an array of URL objects." });
        }

        const detection = await runUrlDetection(urls);
        await persistScan({
            userId,
            urlResults: detection.results,
            serviceStatuses: detection.serviceStatuses
        });

        return res.status(200).json({
            success: true,
            results: detection.results,
            highRiskUrls: detection.highRiskUrls,
            serviceStatuses: detection.serviceStatuses,
            persistence: {
                mongodb: isMongoAvailable()
            },
            fallbackToClient: detection.highRiskUrls.length === 0 &&
                !process.env.OPENAI &&
                !process.env.GOOGLE_SAFE_BROWSING_API_KEY &&
                !(process.env.AZUREURL && process.env.AZUREKEY)
        });

    } catch (error) {
        console.error("❌ Error in validateUrl:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
};

exports.getScans = async (req, res) => {
    try {
        if (requireMongo(res)) return;

        const limit = Math.min(Number(req.query.limit) || 25, 100);
        const userId = req.query.userId ? String(req.query.userId) : null;
        const filter = userId ? { userId } : {};

        const scans = await UrlScan.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.json({
            success: true,
            scans
        });
    } catch (error) {
        console.error("❌ Error in getScans:", error);
        res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
};

exports.getBadLinks = async (req, res) => {
    try {
        if (requireMongo(res)) return;

        const limit = Math.min(Number(req.query.limit) || 50, 200);
        const docs = await BadLink.find({}).lean();
        const badLinks = docs
            .flatMap(doc => doc.badLinks || [])
            .sort((a, b) => {
                const bLastSeen = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
                const aLastSeen = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
                return bLastSeen - aLastSeen || (b.frequency || 0) - (a.frequency || 0);
            })
            .slice(0, limit);

        res.json({
            success: true,
            badLinks
        });
    } catch (error) {
        console.error("❌ Error in getBadLinks:", error);
        res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        if (requireMongo(res)) return;

        const scans = await UrlScan.find({}).sort({ createdAt: -1 }).limit(500).lean();
        const badLinkDocs = await BadLink.find({}).lean();
        const badLinks = badLinkDocs.flatMap(doc => doc.badLinks || []);
        const allUrls = scans.flatMap(scan => scan.urls || []);
        const serviceStatuses = scans.flatMap(scan => scan.serviceStatuses || []);

        const byRisk = allUrls.reduce((acc, item) => {
            acc[item.risk || "Unknown"] = (acc[item.risk || "Unknown"] || 0) + 1;
            return acc;
        }, {});

        const byPlatform = allUrls.reduce((acc, item) => {
            const platform = item.platform || "unknown";
            acc[platform] = (acc[platform] || 0) + 1;
            return acc;
        }, {});

        const serviceHealth = serviceStatuses.reduce((acc, item) => {
            if (!acc[item.name]) {
                acc[item.name] = { fulfilled: 0, failed: 0, timed_out: 0, disabled: 0, total: 0 };
            }
            acc[item.name][item.status] = (acc[item.name][item.status] || 0) + 1;
            acc[item.name].total += 1;
            return acc;
        }, {});

        res.json({
            success: true,
            stats: {
                scans: scans.length,
                urlsAnalyzed: allUrls.length,
                highRiskUrls: allUrls.filter(item => item.risk === "High").length,
                trackedBadLinks: badLinks.length,
                byRisk,
                byPlatform,
                serviceHealth,
                latestScanAt: scans[0]?.createdAt || null
            }
        });
    } catch (error) {
        console.error("❌ Error in getStats:", error);
        res.status(500).json({ success: false, message: "Internal Server Error: " + error.message });
    }
};
