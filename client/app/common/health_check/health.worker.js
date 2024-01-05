const path = require("path");
const fs = require("fs");
let timer;
// consumer health check
const file_healthz_path = path.resolve("/tmp/_healthz");
const changeHealthFile = () => {
    fs.closeSync(fs.openSync(file_healthz_path, "w"));
};
const startHealthCheckDaemon = () => {
    changeHealthFile();
    timer = setInterval(() => {
        changeHealthFile();
    }, 30 * 1000);
};
const stopHealthCheckDaemon = () => {
    timer && clearInterval(timer);
};

module.exports = { startHealthCheckDaemon, stopHealthCheckDaemon };
