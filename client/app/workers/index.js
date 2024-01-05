const conf = require("../../config");

let handler;

if (conf.workerType === "email") {
    handler = require("./EmailWorker");
} else {
    throw " Invalid worker type";
}

module.exports = handler;
