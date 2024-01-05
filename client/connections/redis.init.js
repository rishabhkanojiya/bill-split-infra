const conf = require("../config");
const logger = require("../logger");

const Redis = require("ioredis");

let readOnly;
let readWrite;
let bullConn;
let beeConn;

// BeeQueue expects a constructor with name: `RedisClient` hence this
class RedisClient extends Redis.Cluster {
    constructor(host, port) {
        super(
            [
                {
                    host: host,
                    port: port,
                },
            ],
            {
                scaleReads: "slave",
                redisOptions: {
                    enableReadyCheck: false,
                    enableOfflineQueue: false,
                    maxRetriesPerRequest: null,
                },
            }
        );
    }
}

function getRedisReadOnly() {
    if (!readOnly) {
        readOnly = new Redis(conf.redis.readOnly);
        readOnly.on("connect", () => {
            logger.info("redis readOnly connected");
        });
        readOnly.on("error", (err) => {
            logger.info(`Unable to connect redis readOnly: ${err}`);
        });
    }
    return readOnly;
}

async function disconnectRedisReadOnly() {
    if (readOnly) return await readOnly.disconnect();
}

function getRedisReadWrite() {
    if (!readWrite) {
        readWrite = new Redis(conf.redis.readWrite);
        readWrite.on("connect", () => {
            logger.info("redis readWrite connected");
        });
        readWrite.on("error", (err) => {
            logger.info(`Unable to connect to redis readWrite: ${err}`);
        });
    }
    return readWrite;
}

async function disconnectRedisReadWrite() {
    if (readWrite) return await readWrite.disconnect();
}

/**
 * Creates a new redis read/write connection, if one doesn't exist already.
 * @param {*} enableOfflineQueue Passed value is forwarded to ioredis' `enableOfflineQueue` parameter.
 * @returns
 */
function getBullConn(enableOfflineQueue = true) {
    if (!bullConn) {
        bullConn = new Redis.Cluster(
            [
                {
                    host: conf.redis.jobs.host,
                    port: conf.redis.jobs.port,
                },
            ],
            {
                scaleReads: "slave",
                redisOptions: {
                    enableReadyCheck: false,
                    enableOfflineQueue: enableOfflineQueue,
                    maxRetriesPerRequest: null,
                },
            }
        );

        bullConn.on("connect", () => {
            logger.info("redis bullConn connected");
        });
        bullConn.on("error", (err) => {
            logger.info(`Unable to connect to redis bullConn: ${err}`);
        });
    }
    return bullConn;
}

async function disconnectBullConn() {
    if (bullConn) return await bullConn.disconnect();
}

function getBeeConn(waitForConnection = false) {
    if (!beeConn) {
        beeConn = new RedisClient(conf.redis.jobs.host, conf.redis.jobs.port);
    }
    if (waitForConnection && beeConn.status !== "ready") {
        return new Promise((res, rej) => {
            beeConn.on("connect", () => {
                logger.info("redis beeConn connected");
                res(beeConn);
            });
            beeConn.on("error", (err) => {
                logger.info(`Unable to connect to redis beeConn: ${err}`);
                rej(err);
            });
        });
    }
    return beeConn;
}

async function disconnectBeeConn() {
    if (beeConn) return await beeConn.disconnect();
}

/**
 * Creates a new redis read/write connection.
 * @param {*} enableOfflineQueue Passed value is forwarded to ioredis' `enableOfflineQueue` parameter.
 * @returns
 */
function getDedicatedBullConn(enableOfflineQueue = true) {
    const dedicatedBullConn = new Redis.Cluster(
        [
            {
                host: conf.redis.jobs.host,
                port: conf.redis.jobs.port,
            },
        ],
        {
            scaleReads: "slave",
            redisOptions: {
                enableReadyCheck: false,
                enableOfflineQueue: enableOfflineQueue,
                maxRetriesPerRequest: null,
            },
        }
    );
    dedicatedBullConn.on("connect", () => {
        logger.info("redis dedicatedBullConn connected");
    });
    dedicatedBullConn.on("error", (err) => {
        logger.info(`Unable to connect to redis dedicatedBullConn: ${err}`);
    });

    return dedicatedBullConn;
}

module.exports = {
    getRedisReadWrite,
    disconnectRedisReadWrite,
    getRedisReadOnly,
    disconnectRedisReadOnly,
    getBullConn,
    disconnectBullConn,
    getDedicatedBullConn,
    getBeeConn,
    disconnectBeeConn,
};
