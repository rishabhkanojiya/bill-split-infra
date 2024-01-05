const Sentry = require("@sentry/node");
const _ = require("lodash");

const { topicMapping } = require("../../kafka.config");
const { kafka } = require("../../connections/kafka.init");
const logger = require("../../logger");

class KafkaConsumer {
    constructor(consumerConfig) {
        _.extend(this, consumerConfig);
        this.consumer = kafka.consumer(this.consumerOptions);
    }

    async connect() {
        this.consumer.on(this.consumer.events.CONNECT, (e) => {
            logger.info("consumer CONNECT", e);
        });

        this.consumer.on(this.consumer.events.DISCONNECT, (e) => {
            logger.info("consumer DISCONNECT", e);
        });

        this.consumer.on(this.consumer.events.GROUP_JOIN, (e) => {
            logger.info("consumer GROUP_JOIN", e);
        });

        this.consumer.on(this.consumer.events.STOP, (e) => {
            logger.info("consumer STOP", e);
        });

        this.consumer.on(this.consumer.events.CRASH, (e) => {
            logger.error("consumer CRASH", e);
        });

        this.consumer.on(this.consumer.events.REQUEST_TIMEOUT, (e) => {
            logger.error("consumer REQUEST_TIMEOUT", e);
        });

        await this.consumer.connect();
    }

    async subscribe() {
        logger.info("SUBSCRIBING TO KAFKA TOPIC", this.topics);
        for (let topic of this.topics) {
            await this.consumer
                .subscribe({
                    topic: topic.name,
                    fromBeginning: topic.fromBeginning,
                })
                .catch(console.error);
        }
    }

    async disconnect() {
        logger.info("DISCONNECTING KAFKA CONSUMER");
        await this.consumer.disconnect();
    }

    async start() {
        logger.info("STARTING KAFKA CONSUMER");

        await this.consumer
            .run({
                eachMessage: (kfMessage) => this.processMessage(kfMessage),
            })
            .catch(console.error);
    }

    async processMessage(kfMessage) {
        const { topic, partition, message } = kfMessage;
        const messageLog = { topic, partition, offset: message.offset };

        logger.info("KAFKA_MSG_CONSUMED", messageLog);

        return topicMapping[topic]
            .handle(message)
            .then(() => {
                logger.info("KAFKA_MSG_PROCESS_SUCCESS", messageLog);
                return message;
            })
            .catch(async (err) => {
                logger.error("KAFKA_MSG_PROCESS_FAILED", messageLog);
                Sentry.captureException(err, {
                    tags: {
                        mode: "consumer",
                    },
                    extra: {
                        topic,
                        data: message,
                    },
                });

                return Promise.reject(err);
            });
    }
}

module.exports = KafkaConsumer;
