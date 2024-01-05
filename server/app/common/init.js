let redis = require("../server/redis.init");
let postgres = require("../server/postgres.init");

// exports.postgres = postgres;
// exports.getRedis = redis.getRedis;
// exports.getRedisReadOnly = redis.getRedisReadOnly;
// exports.getRedisConnection = redis.getRedisConnection;
// exports.getAdminRedis = redis.getAdminRedis;
exports.connectAll = () => {
    // postgres.connect();
    // redis.connect();
};
