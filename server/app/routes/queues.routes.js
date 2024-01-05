const express = require("express");
const router = express.Router();
const Arena = require("bull-arena");
const Bee = require("bee-queue");
const conf = require("../../config");

const queueName = conf.queues.queueName;

const arena = Arena(
    {
        Bee,
        queues: [
            {
                name: queueName,
                hostId: "Email",
                type: "bee",
                prefix: "email_",
            },
        ],
    },
    { basePath: "/queues/beeQueue" }
);

router.use(
    "/",
    // (req, res, next) => {
    //     if (conf.env !== "development") {
    //         const adminPathPrefix = new URL(conf.get("services.jiraiya.admin"))
    //             .pathname;
    //         req.baseUrl = urlJoin(adminPathPrefix, req.baseUrl);
    //     }
    //     next();
    // },
    arena
);

module.exports = router;
