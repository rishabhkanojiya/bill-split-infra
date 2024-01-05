const { Model } = require("objection");
const { billSplitDB } = require("../../connections/postgres.init");
const nodemailer = require("nodemailer");

const {
    DoesNotExistError,
    AlreadyExistError,
    InvalidRequestError,
} = require("../utils/errors.utils.js");
const MemberModel = require("./members.model");

Model.knex(billSplitDB);

class GroupModel extends Model {
    static get tableName() {
        return "groups";
    }

    static get idColumn() {
        return "_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "subject"],
            properties: {
                _id: { type: "number" },
                userId: { type: "number" },
                name: { type: "string", minLength: 1, maxLength: 255 },
                subject: { type: "string", minLength: 1, maxLength: 255 },
                image: { type: "string", maxLength: 255 },
                totalAmount: { type: "number" },
                paid: { type: "boolean", default: false },
                reminder: { type: "boolean", default: false },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        const Member = require("./members.model");
        const GroupMember = require("./junction/groupMember.model");

        return {
            members: {
                relation: Model.ManyToManyRelation,
                modelClass: Member,
                join: {
                    from: "groups._id",
                    through: {
                        from: "group_members.groupId",
                        to: "group_members.memberId",
                    },
                    to: "members._id",
                },
            },
            groupMembers: {
                relation: Model.HasManyRelation,
                modelClass: GroupMember,
                join: {
                    from: "groups._id",
                    to: "group_members.groupId",
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

    static async createGroup(group) {
        try {
            return await this.query().insertAndFetch({
                userId: group.userId,
                name: group.name,
                subject: group.subject,
                image: group.image,
                totalAmount: group.totalAmount,
            });
        } catch (err) {
            throw err;
        }
    }

    static async addMemberToGroup({ userId, groupId, memberId }) {
        try {
            const group = await this.query()
                .findById(groupId)
                .where("userId", userId);

            if (!group) {
                throw new DoesNotExistError("Group not found");
            }

            const member = await MemberModel.query().findById(memberId);

            if (!member) {
                throw new DoesNotExistError("Member not found");
            }

            const isMemberInGroup = await group
                .$relatedQuery("members")
                .findById(memberId);

            if (isMemberInGroup) {
                throw new AlreadyExistError("Member is already in the group");
            }

            await group.$relatedQuery("members").relate(memberId);

            return await this.query()
                .findById(groupId)
                .withGraphFetched("members");
        } catch (error) {
            throw error;
        }
    }

    static async addMultipleMemberToGroup({ userId, groupId, memberIds }) {
        try {
            const group = await this.query()
                .findById(groupId)
                .where("userId", userId);

            if (!group) {
                throw new DoesNotExistError("Group not found");
            }

            const members = await MemberModel.query().findByIds(memberIds);

            if (members.length !== memberIds.length) {
                throw new DoesNotExistError("One or more members not found");
            }

            const existingMemberIds = await group
                .$relatedQuery("members")
                .findByIds(memberIds);

            if (existingMemberIds.length > 0) {
                throw new AlreadyExistError(
                    "One or more members are already in the group"
                );
            }

            await group.$relatedQuery("members").relate(memberIds);

            return await this.query()
                .findById(groupId)
                .withGraphFetched("members");
        } catch (error) {
            throw error;
        }
    }

    static async removeMemberToGroup({ userId, groupId, memberId }) {
        try {
            const group = await this.query()
                .findById(groupId)
                .where("userId", userId);

            if (!group) {
                throw new DoesNotExistError("Group not found");
            }

            const member = await MemberModel.query().findById(memberId);

            if (!member) {
                throw new DoesNotExistError("Member not found");
            }

            const isMemberInGroup = await group
                .$relatedQuery("members")
                .findById(memberId);

            if (!isMemberInGroup) {
                throw new DoesNotExistError("Member is not in the group");
            }

            await group
                .$relatedQuery("members")
                .unrelate()
                .where("memberId", memberId);

            return await this.query()
                .findById(groupId)
                .withGraphFetched("members");
        } catch (error) {
            throw error;
        }
    }

    static async updateGroup(groupId, group) {
        try {
            const existingGroup = await this.query().findById(groupId);

            if (!existingGroup) {
                throw new DoesNotExistError("No group found to update");
            }

            return await this.query().patchAndFetchById(groupId, {
                userId: group.userId,
                name: group.name,
                subject: group.subject,
                image: group.image,
                totalAmount: group.totalAmount,
                paid: group.paid,
                reminder: group.reminder,
            });
        } catch (err) {
            throw err;
        }
    }

    static async getGroup(filters) {
        return await this.query().findOne(filters);
    }

    static async getGroupById(groupId) {
        return await this.query().findById(groupId);
    }

    static async getGroups(pageNo, pageSize, searchTag) {
        const query = this.query().orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async getGroupsByUserId({ userId, pageNo, pageSize, searchTag }) {
        const query = this.query()
            .where("userId", userId)
            .orderBy("createdAt", "desc");

        if (searchTag) {
            let splitSearch = searchTag.split(",");
            query.where("tags", "@>", splitSearch);
        }

        return await query.page(pageNo, pageSize);
    }

    static async getGroupWithMembers({ userId, groupId }) {
        try {
            return await this.query()
                .findById(groupId)
                .where("userId", userId)
                .withGraphFetched("members");
        } catch (error) {
            throw new Error(error);
        }
    }

    static async deleteGroupById({ userId, groupId }) {
        try {
            return await this.query()
                .delete()
                .where("_id", groupId)
                .where("userId", userId)
                .returning("*");
        } catch (err) {
            throw err;
        }
    }

    static async getGroupAndMembersForMail({ userId, groupId }) {
        try {
            const group = await this.query()
                .findById(groupId)
                .where("userId", userId)
                .withGraphFetched("members");

            if (!group) {
                throw new DoesNotExistError("Group not found");
            }

            const members = group.members
                ? group.members.filter((member) => !member.paid)
                : [];

            if (members.length === 0) {
                throw new InvalidRequestError(
                    "Every member's payment was already completed."
                );
            }

            return { group, members };
        } catch (error) {
            throw error;
        }
    }

    static async getGroupAndMembersForMailUnpaid() {
        let res = [];
        try {
            const groups = await this.query()
                .where("reminder", true)
                .withGraphFetched("members");

            if (!groups) {
                throw new DoesNotExistError("Group not found");
            }

            for (const group of groups) {
                const unpaidMembers = group.members.filter(
                    (member) => !member.paid
                );

                if (unpaidMembers.length === 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                res.push({ group, unpaidMembers });
            }
            return res;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = GroupModel;
