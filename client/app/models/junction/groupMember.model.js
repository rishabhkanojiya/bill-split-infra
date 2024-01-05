const { Model } = require("objection");
const { billSplitDB } = require("../../../connections/postgres.init");

const {
    DoesNotExistError,
    LimitExceededError,
} = require("../../utils/errors.utils.js");

Model.knex(billSplitDB);

class GroupMembersModel extends Model {
    static get tableName() {
        return "group_members";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["groupId", "memberId"],
            properties: {
                _id: { type: "number" },
                groupId: { type: "string" },
                memberId: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const Group = require("../groups.model");
        const Member = require("../members.model");

        return {
            groups: {
                relation: Model.BelongsToOneRelation,
                modelClass: Group,
                join: {
                    from: "group_members.groupId",
                    to: "groups._id",
                },
            },
            members: {
                relation: Model.BelongsToOneRelation,
                modelClass: Member,
                join: {
                    from: "group_members.memberId",
                    to: "members._id",
                },
            },
        };
    }

    async $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    async $beforeUpdate(opt) {
        this.updatedAt = new Date().toISOString();
        delete this.createdAt;
    }

    // static async createUser(review) {
    //     try {
    //         return await this.query().insertAndFetch({
    //             // userId: review.userId,
    //             name: review.name,
    //             profileUrl: review.profileUrl,
    //             companyUrl: review.companyUrl,
    //             rating: review.rating,
    //             review: review.review,
    //             tags: review.tags,
    //             meta: review.meta,
    //         });
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // /**
    //  * @param  {} reviewId
    //  * @param  {} review
    //  */
    // static async updateUser(reviewId, review) {
    //     try {
    //         const existingReview = await this.query().findById(reviewId);

    //         if (!existingReview) {
    //             throw new DoesNotExistError("No review found to update");
    //         }

    //         return await this.query().patchAndFetchById(reviewId, {
    //             name: review.name,
    //             profileUrl: review.profileUrl,
    //             companyUrl: review.companyUrl,
    //             rating: review.rating,
    //             review: review.review,
    //             tags: review.tags,
    //             meta: review.meta,
    //         });
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // /**
    //  * @param  {} filters
    //  */
    // static async getReview(filters) {
    //     return await this.query().findOne(filters);
    // }

    // /**
    //  * @param  {} reviewId
    //  */
    // static async getReviewById(reviewId) {
    //     return await this.query().findById(reviewId);
    // }

    // /**
    //  * @param  {} pageNo
    //  * @param  {} pageSize
    //  */
    // static async getReviews(pageNo, pageSize, searchTag) {
    //     const query = this.query().orderBy("createdAt", "desc");

    //     if (searchTag) {
    //         let splitSearch = searchTag.split(",");
    //         // POSTGRES's array-containing operator
    //         query.where("tags", "@>", splitSearch);
    //     }

    //     return await query.page(pageNo, pageSize);
    // }

    // /**
    //  * @param  {} reviewId
    //  */
    // static async deleteReviewById(reviewId) {
    //     try {
    //         return await this.query().deleteById(reviewId).returning("*");
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}

module.exports = GroupMembersModel;
