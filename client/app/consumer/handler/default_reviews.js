const logger = require("../../../logger");
const conf = require("../../../config");
const DatasourceModel = require("../../models/reviews.model.js");

class DefaultReviews {
    async createDatasourceAndZone(orgId) {
        try {
            // // check if default datasource is already present
            // const defaultDatasource = await DatasourceModel.getDatasource({
            //     orgId,
            //     isDefault: true,
            // });

            // if (defaultDatasource) {
            //     logger.info(
            //         `Default datasource is already present for Org(${orgId})`
            //     );
            //     return;
            // }

            // const datasource = await DatasourceModel.createDatasource({
            //     orgId,
            //     name: "Default",
            //     type: "pixelbin-storage",
            //     credentials: {},
            //     isDefault: true,
            // });

            console.log({ message: "------consumed------" });
        } catch (err) {
            logger.error(err);
        }
    }

    async handle(message) {
        logger.info(`Handling Message(${message.key})`);

        await this.createDatasourceAndZone(JSON.parse(message.value));

        return true;
    }
}

module.exports = DefaultReviews;
