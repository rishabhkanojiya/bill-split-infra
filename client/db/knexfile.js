"use strict";

const path = require("path");

// require("dotenv").config({ path: "../.env" });

const conf = require("../config");

const migrationDirectories = [path.join(__dirname, "./migrations")];
module.exports = {
    client: "pg",
    connection: conf.postgres.bill_split,
    migrations: {
        directory: migrationDirectories,
    },
};
