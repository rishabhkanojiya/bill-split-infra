let winston = require("winston");
const config = require("../../config");

var options = {
    console: {
        level: config.get("logger.level") || "info",
        handleExceptions: true,
        json: true,
        colorize: false,
    },
};

const { splat, combine, timestamp, json } = winston.format;

// meta param is ensured by splat()
const myFormat = json(({ timestamp, level, message, meta }) => {
    return `${timestamp} ${level} ${message} ${
        meta ? JSON.stringify(meta) : ""
    }`;
});

const logger =
    config.app_env == "development"
        ? winston.createLogger({
              format: combine(timestamp(), splat(), myFormat),
              transports: [new winston.transports.Console(options.console)],
          })
        : console;

module.exports = logger;
