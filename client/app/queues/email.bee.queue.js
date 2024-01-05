const Queue = require("bee-queue");
const IORedis = require("ioredis");
const conf = require("../../config");

class BeeQueueHelper {
    constructor(queueName) {
        this.queue = new Queue(queueName, {
            redis: new IORedis({
                host: conf.redis.host,
                port: conf.redis.port,
            }),
        });
    }

    async addJob(jobId, data) {
        return new Promise((resolve, reject) => {
            const job = this.queue.createJob(data).setId(jobId);

            job.save((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(job.id);
                }
            });
        });
    }

    async getJob(jobId) {
        return new Promise((resolve, reject) => {
            this.queue.getJob(jobId, (err, job) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(job);
                }
            });
        });
    }

    async getOrAddJob(jobId, data) {
        let job = await this.getJob(jobId, data);
        if (!job) {
            job = await this.addJob(jobId, data);
        }
        return job;
    }

    async waitForJobCompletion(jobId) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                this.getJob(jobId)
                    .then((job) => {
                        if (job && job.status === "completed") {
                            clearInterval(interval);
                            resolve(job);
                        }
                    })
                    .catch(reject);
            }, 1000); // Check every 1 second
        });
    }
}

module.exports = BeeQueueHelper;
