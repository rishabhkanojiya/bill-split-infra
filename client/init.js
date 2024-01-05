const Sentry = require("@sentry/node");
const fs = require("fs");

const conf = require("./config");
const packageJson = require("./package.json");
const sentry = conf.get("sentry");
const logger = require("./logger");

const isSentryEnabled = sentry.dsn;
if (!isSentryEnabled) {
    console.log("Overriding Sentry");
    Sentry.captureException = function (err) {
        logger.error(err);
    };
} else {
    let oldCaptureException = Sentry.captureException;
    Sentry.captureException = function (err) {
        logger.error(err);
        oldCaptureException(err);
    };
}

let releaseSHA = packageJson.version;

if (fs.existsSync("gitsha")) {
    releaseSHA = fs.readFileSync("gitsha").toString();
}

const sentryOptions = {
    dsn: sentry.dsn,
    release: releaseSHA,
    environment: sentry.environment,
};
Sentry.init(sentryOptions);

process.on("uncaughtException", (err) => {
    if (isSentryEnabled) {
        Sentry.captureException(err);
    }
});
