const healthWorker = require("../common/health_check/health.worker");
const { consumerConfig } = require("../../kafka.config");
const logger = require("../../logger");
const KafkaConsumer = require("./kafka.consumer");

class Consumer {
    constructor(consumerType) {
        this.consumer = new KafkaConsumer(consumerConfig[consumerType]);
        healthWorker.startHealthCheckDaemon();
    }

    async start() {
        logger.info(`Starting ${this.consumer.name} consumer`);
        await this.consumer.connect();
        await this.consumer.subscribe();
        await this.consumer.start();
    }

    async shutdown(cb) {
        await this.consumer.disconnect();
        healthWorker.stopHealthCheckDaemon();
        cb();
    }
}

module.exports = Consumer;
