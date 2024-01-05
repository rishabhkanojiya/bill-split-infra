"use strict";

// require("dotenv").config({ path: "../.env" });
const conf = require("../config");
const logger = require("../logger");
const knex_configuration = require("../db/knexfile");

const billSplitDB = require("knex")(knex_configuration);

if (conf.env === "development" /*  || conf.env === "test" */) {
    billSplitDB.on("query", (data) => {
        let query = data.sql;
        if (data.bindings) {
            data.bindings.forEach((binding, i) => {
                query = query.replace("$" + (i + 1), binding);
            });
            logger.info(`[QUERY] ${query}`);
        }
    });
}

function disconnect() {
    billSplitDB.destroy((err) => {
        if (err) logger.error(err);
    });
}

module.exports = {
    billSplitDB,
    disconnect,
};
