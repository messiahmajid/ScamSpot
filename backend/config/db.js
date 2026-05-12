const mongoose = require('mongoose');

const connectDB = async () => {
    // Make MongoDB optional
    const mongoUri = process.env.MONGO || process.env.MONGODB_URI;

    if (!mongoUri) {
        console.log('⚠️  MongoDB not configured - running in stateless mode');
        console.log('   (Historical tracking and user data persistence disabled)');
        return false;
    }

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB - advanced features enabled');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('⚠️  Continuing in stateless mode...');
        return false;
    }
};

module.exports = { connectDB };
