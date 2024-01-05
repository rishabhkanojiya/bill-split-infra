const { Model } = require("objection");
const { billSplitDB } = require("../../connections/postgres.init");

const {
    DoesNotExistError,
    LimitExceededError,
    AlreadyExistError,
} = require("../utils/errors.utils.js");

Model.knex(billSplitDB);

class MemberModel extends Model {
    static get tableName() {
        return "members";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "email"],
            properties: {
                _id: { type: "number" },
                userId: { type: "number" },
                name: { type: "string", minLength: 1, maxLength: 255 },
                email: { type: "string" },
                mobile: { type: ["string", "null"] },
                paid: { type: "boolean", default: false },
                amount: { type: ["number", "null"] },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const Group = require("./groups.model");
        const GroupMember = require("./junction/groupMember.model");

        return {
            groups: {
                relation: Model.ManyToManyRelation,
                modelClass: Group,
                join: {
                    from: "members._id",
                    through: {
                        from: "group_members.memberId",
                        to: "group_members.groupId",
                    },
                    to: "groups._id",
                },
            },
            groupMembers: {
                relation: Model.HasManyRelation,
                modelClass: GroupMember,
                join: {
                    from: "members._id",
                    to: "group_members.memberId",
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

    static async createMember(member) {
        try {
            return await this.query().insertAndFetch({
                userId: member.userId,
                name: member.name,
                email: member.email,
                mobile: member.mobile,
                paid: member.paid,
                amount: member.amount,
            });
        } catch (err) {
            if (err.name === "UniqueViolationError") {
                throw new AlreadyExistError("Email or Number Already exists");
            }
            throw err;
        }
    }

    static async updateMember(memberId, member) {
        try {
            const existingGroup = await this.query().findById(memberId);

            if (!existingGroup) {
                throw new DoesNotExistError("No member found to update");
            }

            return await this.query().patchAndFetchById(memberId, {
                name: member.name,
                userId: member.userId,
                email: member.email,
                mobile: member.mobile,
                paid: member.paid,
                amount: member.amount,
            });
        } catch (err) {
            throw err;
        }
    }

    static async getMember(filters) {
        return await this.query().findOne(filters);
    }

    static async getMemberById({ userId, memberId }) {
        return await this.query().findById(memberId).where("userId", userId);
    }

    static async getMembers({ userId, pageNo, pageSize, searchTag }) {
        const query = this.query()
            .where("userId", userId)
            .orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            // POSTGRES's array-containing operator
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async deleteMemberById({ userId, memberId }) {
        try {
            return await this.query()
                .where("_id", memberId)
                .where("userId", userId)
                .returning("*");
        } catch (err) {
            throw err;
        }
    }
}

module.exports = MemberModel;
