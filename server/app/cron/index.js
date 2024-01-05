const cronRunner = require("./emailCron");

cronRunner.run().catch(() => {
    process.exit(1);
});

function shutdown(cb) {
    cb();
}

module.exports = {
    shutdown,
};
