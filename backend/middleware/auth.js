const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("233153684342-icqu1cr7dlj8k6j9ea3ea7golbljh2cp.apps.googleusercontent.com");

// Verify Google ID Token middleware
const verifyGoogleToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: "Authorization header missing or invalid"
            });
        }

        const idToken = authHeader.split(' ')[1];
        const ticket = await client.verifyIdToken({
            idToken,
            audience: [
                process.env.EXTENSION_GOOGLE_CLIENT_ID,
                process.env.GOOGLE
            ]
        });

        res.locals.payload = ticket.getPayload();
        next();
    } catch (err) {
        console.error('Google token verification error:', err);
        res.status(401).json({
            error: "Invalid authentication token",
            details: err.message
        });
    }
};

// Session authentication middleware
const isLoggedIn = (req, res, next) => {
    if (req.session?.userId) {
        console.log(`Authenticated user: ${req.session.userId}`);
        return next();
    }

    console.warn('Unauthorized access attempt');
    res.status(401).json({
        error: "Not authenticated - please log in",
        code: "NO_VALID_SESSION"
    });
};

module.exports = {
    verifyGoogleToken,
    isLoggedIn
};