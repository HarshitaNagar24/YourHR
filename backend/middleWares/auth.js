const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
    // Extract token from cookies or authorization header
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
        // No token provided, proceed to the next middleware
        return next();
    }
    try {
        // Assuming getUser verifies and decodes the token
        const user = getUser(token);

        if (!user) {
            // Invalid token or user not found
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach user information to the request object
        req.user = user;
    } catch (error) {
        // Handle token errors
        return res.status(401).json({ message: 'Authentication failed', error: error.message });
    }

    // Proceed to the next middleware
    next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({ message: "No User Found" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        return next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};
