const jwt = require("jsonwebtoken");
const conf = require("../../config");
const {
    UnauthorizedError,
    InvalidRequestError,
} = require("../utils/errors.utils");

function isAuthenticated(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        throw new UnauthorizedError("Access denied | Please Login Again");
    }

    try {
        const decoded = jwt.verify(token, conf.jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        throw new InvalidRequestError("Invalid token");
    }
}

exports.isAuthenticated = isAuthenticated;
