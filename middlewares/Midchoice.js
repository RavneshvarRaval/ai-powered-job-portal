const customAuthenticate = require('./isAuthenticated');

const authMiddleware = async (req, res, next) => {
    try {
        return customAuthenticate(req, res, next);
    } catch (error) {
        console.error("Middleware error:", error.message);
        return res.status(500).json({ message: "Authentication error", details: error.message });
    }
};

module.exports = authMiddleware;
