const express = require('express');
const cors = require('cors');
const session = require('express-session');  // ✅ Import express-session
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const authRouter = require('./routes/auth');
const searchUri = require('./repos/webrisk');
const { isLoggedIn } = require('./middleware/auth');
const path = require('path');
const MessageAnalyzer = require('./repos/image_analysis');
const SentimentAnalyzer = require('./repos/sentiment_analysis');
const UrlAnalyzer = require('./repos/url_analysis');
const ScamMessageAnalyzer  = require('./repos/message_last_step')
const { scamClassifier } = require('./repos/decision_tree_classifier');
const urlRouter = require('./routes/bad_linksRouter');
const imageRouter = require('./routes/image_analysis_router');

const app = express();
const port = process.env.PORT || 3000;

// Feature flags based on environment variables
const features = {
    mongodb: false,
    openai: !!process.env.OPENAI,
    azure: !!(process.env.AZUREURL && process.env.AZUREKEY),
    googleAuth: !!process.env.GOOGLE,
    safeBrowsing: !!process.env.GOOGLE_SAFE_BROWSING_API_KEY
};




const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:3001', // React Frontend
            'chrome-extension://iagcokkhpnffadlppbbnodjmkkoiijln', // Chrome Extension
            'https://x.com' ,
            "https://web.whatsapp.com",
            "https://mail.google.com",
            "https://www.instagram.com",
            "https://learn.microsoft.com"// ✅ Allow Twitter if needed
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.error(`❌ CORS BLOCKED ORIGIN: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};


// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// ✅ Initialize express-session BEFORE routes
app.use(session({
    name: 'ScamSpot-session',
    secret: process.env.SECRET || 'default-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 31 * 24 * 60 * 60 * 1000 // 31 days
    }
}));

// Database connection
const startServer = async () => {
    try {
        // Attempt MongoDB connection (optional)
        features.mongodb = await connectDB();

        // Display enabled features
        console.log('\n📊 Server Configuration:');
        console.log(`   Mode: ${Object.values(features).some(v => v) ? 'Advanced' : 'Standalone'}`);
        console.log(`   MongoDB: ${features.mongodb ? '✅' : '❌'}`);
        console.log(`   OpenAI: ${features.openai ? '✅' : '❌'}`);
        console.log(`   Azure: ${features.azure ? '✅' : '❌'}`);
        console.log(`   Google Auth: ${features.googleAuth ? '✅' : '❌'}`);
        console.log(`   Safe Browsing: ${features.safeBrowsing ? '✅' : '❌'}\n`);

        app.listen(port, () => {
            console.log(`🚀 ScamSpot Backend running on http://localhost:${port}`);
            console.log(`   Health check: http://localhost:${port}/health\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// ✅ Register routes after middleware
app.use('/auth', authRouter);

// Health check endpoint for extension
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        features,
        mode: Object.values(features).some(v => v) ? 'advanced' : 'standalone'
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('ScamSpot Backend - Server is operational. Visit /health for status.');
});

app.use("/",urlRouter)
app.use("/",imageRouter)

// Start the server
startServer();
