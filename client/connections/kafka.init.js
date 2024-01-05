const { Kafka, CompressionCodecs, CompressionTypes } = require("kafkajs");
const LZ4 = require("kafkajs-lz4");

const conf = require("../config");
const logger = require("../logger");

CompressionCodecs[CompressionTypes.LZ4] = new LZ4().codec;

const kafkaConfig = {
    clientId: `bill-split-${conf.get("mode")}-${conf.get("consumerType")}`,
    brokers: conf.get("kafka.brokers").split(","),
};

const kafka = new Kafka(kafkaConfig);

const producer = kafka.producer();

module.exports = {
    kafka,
    producer,
};
