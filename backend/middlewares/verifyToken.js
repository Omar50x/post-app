const jwt = require("jsonwebtoken");

// Verify token
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization;
    if (authToken) {
        const token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token, access denied" });
        }
    } else {
        return res.status(401).json({ message: "No token provided, access denied" });
    }
}

// Verify token & admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only admin" });
        }
    });
}

// Verify token & only user himself
function verifyTokenAndOnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only user himself" });
        }
    });
}

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser
}