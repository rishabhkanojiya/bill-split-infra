const Queue = require("bee-queue");
const conf = require("../../../config");
const logger = require("../../../logger");
const { EmailService } = require("../../services");
const { emailConfig } = require("../../services/emailService/constants");
const IORedis = require("ioredis");

const queueName = conf.queues.queueName;
const redisClient = new IORedis({
    host: conf.redis.host,
    port: conf.redis.port,
});

const emailQueue = new Queue(queueName, { redis: redisClient });

emailQueue.process(conf.queues.concurrency, async function (job, done) {
    const { group, member } = job.data;

    const emailService = new EmailService(emailConfig);

    logger.info(`Job Started For ${job.id}`);

    await emailService.sendEmail(group, member);

    done();
});

emailQueue.on("ready", () => {
    logger.info(`${emailQueue.name} Worker is ready`);
});

emailQueue.on("error", (err) => {
    logger.error(err);
    process.exit(0);
});

emailQueue.on("succeeded", (job, result) => {
    const queueName = job.queue?.name;
    const startTimestamp = job.options?.timestamp;
    const { member } = job.data;

    console.log(
        `Mail Sent to '${member.name}' at '${member.email}' at ${new Date(
            startTimestamp
        ).toLocaleString()}`
    );
    // console.log(`${queueName} succeeded at ${startTimestamp}`);
});

emailQueue.on("failed", (job, err) => {
    const queueName = job.queue?.name;
    const startTimestamp = job.options?.timestamp;

    console.log(`${queueName} failed at ${startTimestamp}`);
});

const onShutdown = async (cb) => {
    await emailQueue.close();
    cb();
};

module.exports = {
    emailQueue,
    shutdown: onShutdown,
};
