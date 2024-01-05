#!/bin/bash

set -x

docker rm bill-split
docker build . -t bill-split
docker run --net=host -p $1:$1 --name=bill-split --env-file ./.env \
    -e POSTGRES_BILL_SPLIT_READ_WRITE="postgres://root:root@host.docker.internal:5432/bill-split" \
    bill-split:latest
