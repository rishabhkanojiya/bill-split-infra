const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");

const conf = require("../../config");
const constants = require("../../constants");

const routeUtils = {
    validate: (req, res, next) => {
        const errors = validationResult(req).formatWith(({ msg }) => msg);

        if (errors.isEmpty()) {
            next();
        } else {
            throw routeUtils.formatValidateError(errors);
        }
    },

    getReqData: (req, res, next) => {
        /* istanbul ignore else */
        if (["development", "test"].includes(conf.env)) {
            req.org = {
                _id: 1,
                cloudName: "fynd-eg",
            };
            req.user = {
                _id: 1,
                name: "jiraiya",
            };
        } else {
            const orgData = req.header("x-org-data");
            const appData = req.header("x-app-data");
            const userData = req.header("x-user-data");
            if (!orgData) {
                let error = new Error("Missing organization data from request");
                error.status = 401;
                error.errorCode = "BS-0401";
                throw error;
            }
            if (!userData) {
                let error = new Error("Missing user data from request");
                error.status = 401;
                error.errorCode = "BS-0401";
                throw error;
            }
            req.org = JSON.parse(orgData);
            req.user = JSON.parse(userData);
            if (appData) req.app = JSON.parse(appData);
        }
        next();
    },

    formatValidateError: (errors) => {
        const error = new Error("Unexpected input value");
        error.errorCode = "BS-0422";
        error.status = 422;
        error.meta = { errors: errors.mapped() };
        error.name = "ValidationError";
        return error;
    },

    formatErrorResponse: (error, req) => {
        error = error || {};
        const status = error.status || 500;

        const errorCode = error.errorCode || `BS-${status}`;

        const errorResponse = {
            message:
                status === 500
                    ? "We're unable to process your request at the moment"
                    : error.customMessage ||
                      error.message ||
                      constants.DEFAULT_ERROR_MESSAGE,
            status,
            code: errorCode,
            exception: error.name,
        };

        if (conf.get("env") === "development") {
            errorResponse.stackTrace = error.stack || "";
        }
        if (error.meta) {
            errorResponse.meta = error.meta;
        }

        if (errorResponse.status === 500) {
            Sentry.captureException(error, {
                tags: {
                    req: req.originalUrl,
                },
            });
        }

        return errorResponse;
    },
};

module.exports = routeUtils;
