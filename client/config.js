"use strict";

const _ = require("lodash");
const convict = require("convict");

const conf = convict({
    // Server Configuration
    env: {
        doc: "node env",
        format: String,
        default: "development",
        env: "NODE_ENV",
        arg: "node_env",
    },
    mode: {
        doc: "app mode",
        format: String,
        default: "server",
        env: "MODE",
        arg: "mode",
    },
    serverType: {
        doc: "server type",
        format: String,
        default: "",
        env: "SERVER_TYPE",
        arg: "server_type",
    },
    workerType: {
        doc: "worker type",
        format: String,
        default: "",
        env: "WORKER_TYPE",
        arg: "worker_type",
    },

    port: {
        doc: "The port to bind",
        format: "port",
        default: "",
        env: "PORT",
        arg: "port",
    },
    enableCORS: {
        doc: "cors toggle",
        format: Boolean,
        default: "",
        env: "ENABLE_CORS",
        arg: "enable_cors",
    },

    // Databases Credentials
    redis: {
        host: {
            doc: "redis host",
            format: String,
            default: "",
            env: "REDIS_HOST",
            arg: "redis_host",
        },
        port: {
            doc: "redis port",
            format: "port",
            default: "",
            env: "REDIS_PORT",
            arg: "redis_port",
        },
    },
    postgres: {
        bill_split: {
            doc: "postgresql url of bill_split DB",
            format: String,
            default: null,
            env: "POSTGRES_BILL_SPLIT_READ_WRITE",
            arg: "postgres_bill_split_read_write",
        },
    },
    // postgres: {
    //     template: {
    //         readWrite: {
    //             doc: "postgresql url of rupika",
    //             format: String,
    //             default: "postgres://noel:postgres@localhost:5432/rupika",
    //             env: "POSTGRES_ERASEBG_READ_WRITE",
    //             arg: "postgrse_rupika_read_write",
    //         },
    //         readOnly: {
    //             doc: "postgresql url of rupika",
    //             format: String,
    //             default: "",
    //             env: "POSTGRES_ERASEBG_READ_ONLY",
    //             arg: "postgrse_rupika_read_only",
    //         },
    //     },
    // },
    kafka: {
        brokers: {
            doc: "Kafka Brokers List",
            format: String,
            default: "localhost:9092",
            env: "KAFKA_BROKER_LIST",
            arg: "kafka_broker_list",
        },
        topics: {
            reviewCreate: {
                doc: "Topic for when an created is created/updated",
                format: String,
                default: "create-review",
                env: "KAFKA_TOPIC_REVIEW_UPDATE",
                arg: "kafka_topic_review_update",
            },
        },
    },
    kafkaConsumerGroupName: {
        doc: "Kafka consumer group name",
        format: String,
        default: "bill-split-group",
        env: "KAFKA_CONSUMER_GROUP_NAME",
        arg: "kafka_consumer_group_name",
    },
    consumerType: {
        doc: "consumer type",
        format: String,
        default: "default",
        env: "CONSUMER_TYPE",
        arg: "consumer_type",
    },

    // Internal Analytics

    sentry: {
        dsn: {
            doc: "sentry url",
            format: String,
            default: "",
            env: "SENTRY_DSN",
            arg: "sentry_dsn",
        },
        environment: {
            doc: "sentry environment",
            format: String,
            default: "",
            env: "SENTRY_ENVIRONMENT",
            arg: "sentry_environment",
        },
    },
    aes: {
        privateKey: {
            doc: "aes private key",
            format: String,
            default: "",
            env: "AES_PRIVATE_KEY",
            arg: "aes_private_key",
        },
        salt: {
            doc: "aes salt",
            format: String,
            default: "",
            env: "AES_SALT",
            arg: "aes_salt",
        },
    },
    stripe: {
        publishableKey: {
            doc: "publishable api key for stripe",
            format: String,
            default: "",
            env: "STRIPE_PUBLISHABLE_API_KEY",
            arg: "stripe_publishable_api_key",
        },
        secretKey: {
            doc: "secret api key for stripe",
            format: String,
            default: "",
            env: "STRIPE_SECRET_API_KEY",
            arg: "stripe_secret_api_key",
        },
        webhookSecret: {
            doc: "webhook secret for stripe",
            format: String,
            default: "",
            env: "STRIPE_WEBHOOK_SECRET",
            arg: "stripe_webhook_secret",
        },
    },
    prometheus: {
        metricsDir: {
            doc: "Directory for prometheus metrics",
            format: String,
            default: "",
            env: "METRICS_DIR",
            arg: "metrics_dir",
        },
    },
    logger: {
        level: {
            doc: "Logger Level",
            format: String,
            default: "",
            env: "LOGGER_LEVEL",
            arg: "logger_level",
        },
    },
    email: {
        emailType: {
            doc: "Email TYPE",
            format: String,
            default: "test",
            env: "EMAIL_TYPE",
            arg: "email_type",
        },
        id: {
            doc: "Email Id",
            format: String,
            default: "",
            env: "EMAIL_ID",
            arg: "email_id",
        },
        token: {
            doc: "Email Password",
            format: String,
            default: "",
            env: "EMAIL_TOKEN",
            arg: "email_token",
        },
    },
    workerType: {
        doc: "worker type",
        format: String,
        default: "email",
        env: "WORKER_TYPE",
        arg: "worker_type",
    },
    queues: {
        queueName: {
            doc: "email queue name",
            format: String,
            default: "EMAIL_WORKER_QUEUE_1",
            env: "QUEUE_NAME",
        },
        concurrency: {
            doc: "Email worker concurrency",
            format: Number,
            default: 5,
            env: "WORKER_CONCURRENCY",
        },
    },
    jwtSecret: {
        doc: "JWT_SECRET",
        format: String,
        default: "",
        env: "JWT_SECRET",
    },
});

// Perform validation
conf.validate({
    allowed: "strict",
});
_.extend(conf, conf.get());

module.exports = conf;
