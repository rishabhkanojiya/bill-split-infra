const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const uuid = require("uuid");
const swaggerJSDoc = require("swagger-jsdoc");
const Sentry = require("@sentry/node");
const logger = require("../logger");

const constants = require("../constants");
const conf = require("../config");
const routeUtils = require("./utils/route.utils");
const { recordRequestStart } = require("./middlewares/common.middleware");

function getAppServer(serverType) {
    const app = express();

    /* istanbul ignore next */
    if (conf.env !== "test") {
        app.use(Sentry.Handlers.requestHandler());
        app.set("trust proxy", 1);
    }

    app.set("trust proxy", true);

    const checkHealth = (_req, res) => {
        return res.json({ ok: "ok" });
    };

    app.get("/_healthz", checkHealth);
    app.get("/_readyz", checkHealth);

    const allowedHeaders = [
        "content-type",
        "Content-Range",
        "Range",
        "authorization",
    ];

    const exposedHeaders = [
        "Accept-Ranges",
        "Content-Encoding",
        "Content-Length",
        "Content-Range",
        "Content-Disposition",
    ];

    let corsAllowedDomain = function (req, callback) {
        let corsOptions = {
            origin: "*",
            credentials: true,
            maxAge: 86400,
            allowedHeaders,
            exposedHeaders,
        };

        if (conf.env === "development") {
            corsOptions = {
                origin: true,
                credentials: true,
            };
        }

        callback(null, corsOptions);
    };

    if (conf.get("enableCORS")) {
        const setCORS = cors(corsAllowedDomain);
        app.use(function (req, res, next) {
            if (req.header(constants.SKIP_CORS_HEADER) !== "true") {
                setCORS(req, res, next);
            } else {
                next();
            }
        });
    }

    app.use(cookieParser());
    app.use(bodyParser.json());

    app.disable("x-powered-by");

    // swagger setup
    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: "Bill-Split",
                version: "1.0.0",
                description: "Review Service",
            },
            openapi: "3.0.2",
        },
        apis: [`${process.cwd()}/app/swagger/index.yaml`],
        basePath: "/service/panel/reviews/v1.0",
    };
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.get("/swagger.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    if (serverType === "internal") {
        require("./routes/internal")(app);
        const queuesRoute = require("./routes/queues.routes");
        app.use(queuesRoute);
    } else if (serverType === "panel") {
        app.use(recordRequestStart);
        require("./routes/panel")(app);
    } else {
        throw "Invalid Server Type";
    }

    app.use((req, res, next) => {
        next(createError(404));
    });

    /* istanbul ignore next */
    if (conf.env !== "test") {
        app.use(Sentry.Handlers.errorHandler());
    }

    app.use((error, req, res, next) => {
        const errorResponse = routeUtils.formatErrorResponse(error, req);
        /**
         * For CDN requests error could be thrown after the content-type was set.
         * Hence we again set the content-type header to JSON.
         */
        !res.headersSent && res.type("application/json");
        res.status(errorResponse.status).json(errorResponse);
        logger.error(errorResponse);
    });

    return app;
}

exports.getAppServer = getAppServer;
exports.shutdown = async (cb) => {
    // Any teardown operations related to the server, go here
    cb();
};
