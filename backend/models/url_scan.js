const mongoose = require('mongoose');

const UrlScanSchema = new mongoose.Schema({
    userId: {
        type: String,
        index: true
    },
    urls: [
        {
            url: String,
            platform: String,
            risk: String,
            score: Number,
            reasons: [String],
            services: mongoose.Schema.Types.Mixed
        }
    ],
    serviceStatuses: [
        {
            name: String,
            status: String,
            durationMs: Number,
            error: mongoose.Schema.Types.Mixed
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('UrlScan', UrlScanSchema);
