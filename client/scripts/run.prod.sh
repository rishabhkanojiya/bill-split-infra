#!/bin/bash

if [[ -z "$1" ]]; then
    echo "Running PANEL Server 💃"
    export MODE="server"
    export SERVER_TYPE="internal"
elif [[ $1 = "email-worker" ]]; then
    echo "Running email Worker 💃"
    export MODE="worker"
    export WORKER_TYPE="email"
    export QUEUE_NAME="EMAIL_WORKER_QUEUE_1"
    export WORKER_CONCURRENCY="5"
elif [[ $1 = "email-cron" ]]; then
    echo "Running Email Cron 💃"
    export MODE="cron"
elif [[ $1 = "default-reviews" ]]; then
    echo "Running Default Review 🛸"
    export MODE="consumer"
    export CONSUMER_TYPE="DefaultReviews"
fi

node index.js
