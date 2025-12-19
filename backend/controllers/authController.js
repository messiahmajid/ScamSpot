const User = require("../models/user");

exports.login = async (req, res, next) => {
    try {
        const payload = res.locals.payload;
        console.log(payload);
        const googleId = payload['sub'];
        console.log(googleId);

        let user = await User.findOne({ googleId }).exec();

        if (!user) {
            console.log("First sign in. Creating new user account.");
            user = await User.create({
                googleId: googleId,
                email: payload['email'],
                firstName: payload['given_name'],
                profilePicUrl: payload['picture']
            });

            console.log(`Created new user: ${user._id}`);
        }

        console.log(`Creating session cookie with _id: ${user._id}`);
        req.session.userId = user._id;

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                profilePicUrl: user.profilePicUrl
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Authentication failed" + error
        });
    }
};

exports.logout = (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error("Logout error:", err);
                return res.status(500).json({ success: false });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.session.userId; // Get the user ID from the session
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not logged in" });
        }

        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                profilePicUrl: user.profilePicUrl,
            },
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
};