const express = require("express");
const router = express.Router();
// const { getRedis, getRedisReadOnly } = require('../init');
// const redis = getRedis();
// const readOnlyRedis = getRedisReadOnly()
const config = require("../../../config");
const client = require("prom-file-client").prometheus; // for prometheus client
const register = require("prom-file-client").fileRegistry.getInstance({
    metricsDir: config.metrics_dir,
});
const labelEnum = {
    type: "type",
    name: "name",
};
const logErrorCounter = new client.Counter({
    name: "grimlock_storefront_error_log_event",
    help: "Event produced when error log is created",
    labelNames: [labelEnum.type, labelEnum.name],
    register: register,
});

// function getRedisStatus(redisConnection, redisDbName) {
//     return new Promise((resolve, reject) => {
//         redisConnection.ping((err, result) => {
//             if(result !== 'PONG' || err){
//                 logErrorCounter.labels('redis',redisDbName).inc();
//                 return resolve({
//                     [redisDbName]: {
//                         error: err && err.message || 'Redis Error',
//                         timestamp: Date.now()
//                     }
//                 })
//             }
//             resolve({})
//         })
//     })
// }

const checkHealth = async (req, res, next) => {
    let errorObj = {
        mongodb: {},
        redis: {},
        kafka: {},
    };
    // for redis
    errorObj.redis = {
        ...errorObj.redis,
        // ...await getRedisStatus(redis, 'grimlock_redis'),
        // ...await getRedisStatus(readOnlyRedis, 'grimlock_read_only_redis'),
    };
    // for kafka
    // let kafkaAdmin = Kafka && Kafka.admin && Kafka.admin();
    // errorObj.kafka = { ...errorObj.kafka, ...await getKafkaStatus(kafkaAdmin, config.kafka.brokers) };

    if (
        !Object.keys(errorObj.redis).length &&
        !Object.keys(errorObj.kafka).length
    ) {
        return res.json({
            ok: "ok",
        });
    }
    return res.status(500).json(errorObj);
};

router.get("/_healthz", checkHealth);
router.get("/_readyz", checkHealth);

module.exports = router;
