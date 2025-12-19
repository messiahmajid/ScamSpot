const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const MessageAnalyzer = require('../repos/image_analysis');
const SentimentAnalyzer = require('../repos/sentiment_analysis');
const ScamMessageAnalyzer = require('../repos/message_last_step');
const ScamClassifierService = require("../repos/decision_tree_classifier");

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        cb(null, allowedTypes.includes(file.mimetype));
    }
});

exports.analyzeImage = [
    upload.single('image'),
    async (req, res) => {
        let imagePath;
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid file type. Only JPEG/PNG/GIF allowed (max 5MB)."
                });
            }

            imagePath = req.file.path;
            console.log(`Processing: ${path.basename(imagePath)}`);

            const messageAnalyzer = new MessageAnalyzer();
            const sentimentAnalyzer = new SentimentAnalyzer();
            const scamClassifier = new ScamClassifierService();
            const scamMessageAnalyzer = new ScamMessageAnalyzer();

            // Extract messages from image
            const extraction = await messageAnalyzer.analyze(imagePath);
            if (extraction.error || !extraction.messages) {
                return res.status(422).json(extraction);
            }
            console.log(extraction.messages);

            // Run analyses sequentially
            const sentimentResults = await sentimentAnalyzer.analyzeConversation(extraction.messages);
            const classifiedMessages = scamClassifier.classifyConversation(sentimentResults);
            const finalResults = await scamMessageAnalyzer.analyzeScamMessages(classifiedMessages);

            // Filter only scam messages
            const scamOnlyMessages = finalResults.filter(msg => msg.scamPrediction === "scam");

            return res.json({
                success: true,
                platform: extraction.platform,
                recipient: extraction.recipient,
                messages: scamOnlyMessages // ✅ Only scam messages returned
            });

        } catch (error) {
            console.error(`Processing Error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: error.message.includes('API')
                    ? 'Analysis service unavailable'
                    : 'Processing failed. Please try another image.'
            });

        } finally {
            if (imagePath) {
                await fs.unlink(imagePath).catch(err =>
                    console.error('Cleanup error:', err.message)
                );
            }
        }
    }
];
