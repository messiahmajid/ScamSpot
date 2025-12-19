const mongoose = require('mongoose');

const BadLinkSchema = new mongoose.Schema({
    badLinks: [
        {
            url: String,       // The URL that is flagged
            risk: String,      // Risk level (High/Low)
            frequency: Number,
            userId:String// How many times this link has been detected
        }
    ]
});

const BadLink = mongoose.model('BadLink', BadLinkSchema);

module.exports = BadLink;
