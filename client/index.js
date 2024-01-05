const conf = require("./config");
const logger = require("./logger");

if (conf.env == "production") {
    console.log("production mode");
}

const mode = conf.get("mode");
let handler;
if (mode === "server") {
    const serverType = conf.get("serverType");
    handler = require("./app/server");
    const app = handler.getAppServer(serverType);
    const PORT = conf.get("port");
    const httpServer = app.listen(PORT, () => {
        logger.info("server started at http://localhost:" + PORT);
    });
} else if (mode === "worker") {
    handler = require("./app/workers");
} else if (mode === "cron") {
    handler = require("./app/cron");
} else if (mode === "consumer") {
    const Consumer = require("./app/consumer");
    const handler = new Consumer(conf.consumerType);
    handler.start();
} else {
    throw "Invalid mode";
}

process.on("SIGTERM", function () {
    handler.shutdown().finally(() => process.exit(0));
});
