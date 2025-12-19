const mongoose = require('mongoose');

const connectDB = async () => {
    // Make MongoDB optional
    if (!process.env.MONGO) {
        console.log('⚠️  MongoDB not configured - running in stateless mode');
        console.log('   (Historical tracking and user data persistence disabled)');
        return false;
    }

    try {
        await mongoose.connect(process.env.MONGO, {
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