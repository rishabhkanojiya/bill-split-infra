#!/bin/bash

export SERVER_TYPE='test'
export NODE_ENV='test'
export ENV='test'
export PORT=9069
export POSTGRES_ERASEBG_READ_WRITE="postgres://user:password@localhost:5432/db"
npm run test
