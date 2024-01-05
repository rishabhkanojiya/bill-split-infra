const GroupsHandler = require("../../handler/group.handler");
const cron = require("node-cron");
const logger = require("../../../logger");

async function run() {
    try {
        // const schedule = "* 11 * * *";
        // const schedule = "* * * * *";
        // const schedule = "43 18 * * *";
        const schedule = "*/30 * * * * *";

        cron.schedule(schedule, () =>
            GroupsHandler.checkAndSendPaymentReminders()
        );

        logger.info("Payment reminders sent successfully!");
    } catch (error) {
        console.log("error:", error);
        throw new Error(error);
    }
}

exports.run = run;
