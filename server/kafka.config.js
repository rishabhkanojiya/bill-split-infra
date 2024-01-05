const conf = require("./config");
const DefaultReviewsHandler = require("./app/consumer/handler/default_reviews.js");

const { reviewCreate } = conf.kafka.topics;

const TOPICS = {
    ORG_UPDATE: reviewCreate,
};

module.exports.consumerConfig = {
    DefaultReviews: {
        name: "DefaultReviews",
        consumerOptions: {
            groupId: `${reviewCreate}-${conf.kafkaConsumerGroupName}`,
        },
        messageCount: 1,
        topics: [{ name: TOPICS.ORG_UPDATE, fromBeginning: false }],
    },
};

module.exports.topicMapping = {
    [TOPICS.ORG_UPDATE]: new DefaultReviewsHandler(),
};
