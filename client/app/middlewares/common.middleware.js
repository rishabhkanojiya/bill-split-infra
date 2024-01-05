const recordRequestStart = (req, res, next) => {
    req.reqStartTime = Date.now();
    next();
};

module.exports = {
    recordRequestStart,
};
