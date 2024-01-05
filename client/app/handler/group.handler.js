const GroupsModel = require("../models/groups.model");
const { DoesNotExistError } = require("../utils/errors.utils");
const BeeQueueHelper = require("../queues/email.bee.queue");
const conf = require("../../config");

const GroupsHandler = {
    getGroup: async (req, res) => {
        const { userId } = req;
        const { groupId } = req.params;

        try {
            const group = await GroupsModel.getGroupWithMembers({
                userId,
                groupId,
            });

            if (!group) {
                throw new DoesNotExistError("No group found");
            }

            res.json(group);
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to fetch group, please try again later.";
            throw err;
        }
    },
    getGroups: async (req, res) => {
        const { userId } = req;
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;

        try {
            const result = await GroupsModel.getGroupsByUserId({
                userId,
                pageNo: pageNo - 1,
                pageSize,
                searchTag,
            });

            const { results: items, total: itemTotal } = result;

            const page = {
                type: "number",
                size: items.length,
                current: pageNo,
                hasNext: pageNo * pageSize < itemTotal,
                itemTotal,
            };

            return res.json({ page, items });
        } catch (err) {
            err.customMessage =
                "Unable to fetch groups, please try again later.";
            throw err;
        }
    },
    deleteGroup: async (req, res) => {
        const { userId } = req;
        const { groupId } = req.params;

        try {
            const deleteCount = await GroupsModel.deleteGroupById({
                userId,
                groupId,
            });

            if (!deleteCount) {
                throw new DoesNotExistError("No group found");
            }

            return res.json({
                message: "Successfully deleted group and all related data",
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to delete group, please try again later.";
            throw err;
        }
    },

    createGroup: async (req, res) => {
        const { userId } = req;
        // const { _id: userId } = req.user;
        const data = {
            userId,
            name: req.body.name,
            subject: req.body.subject,
            image: req.body.image,
            totalAmount: req.body.totalAmount,
        };

        try {
            const group = await GroupsModel.createGroup(data);

            res.json({
                message: "Created new group",
                group,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to create group, please try again later.";
            throw err;
        }
    },

    updateGroup: async (req, res) => {
        // const { _id: userId } = req.user;
        const { userId } = req;

        const data = {
            userId,
            name: req.body.name,
            subject: req.body.subject,
            image: req.body.image,
            paid: req.body.paid,
            reminder: req.body.reminder,
            totalAmount: req.body.totalAmount,
        };

        const { groupId } = req.params;

        try {
            const group = await GroupsModel.updateGroup(groupId, data);

            res.json({
                message: "Updated group",
                group,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to update group, please try again later.";
            throw err;
        }
    },

    addMemberToGroup: async (req, res) => {
        const { userId } = req;
        const { groupId, memberId } = req.params;

        try {
            const group = await GroupsModel.addMemberToGroup({
                userId,
                groupId,
                memberId,
            });

            res.json({
                message: "Member Added to Group",
                group,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to add member to group, please try again later.";
            throw err;
        }
    },

    addMultipleMemberToGroup: async (req, res) => {
        const { userId } = req;
        const { groupId } = req.params;
        const { memberIds } = req.body;

        try {
            const group = await GroupsModel.addMultipleMemberToGroup({
                userId,
                groupId,
                memberIds,
            });

            res.json({
                message: "Member Added to Group",
                group,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to add member to group, please try again later.";
            throw err;
        }
    },

    removeMemberToGroup: async (req, res) => {
        const { userId } = req;
        const { groupId, memberId } = req.params;

        try {
            const group = await GroupsModel.removeMemberToGroup({
                userId,
                groupId,
                memberId,
            });

            res.json({
                message: "Member Removed from Group",
                group,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to remove member from group, please try again later.";
            throw err;
        }
    },

    sendEmailToGroupMembers: async (req, res) => {
        const { userId } = req;
        const { groupId } = req.params;
        const queueName = conf.queues.queueName;

        try {
            const { group, members } =
                await GroupsModel.getGroupAndMembersForMail({
                    userId,
                    groupId,
                });

            members.map(async (member) => {
                let jobId = [
                    group.name,
                    member._id,
                    member.name,
                    new Date().getTime(),
                ].join(":");

                const emailBeeQueue = new BeeQueueHelper(queueName);

                let { image, subject, totalAmount } = group;

                emailBeeQueue.getOrAddJob(jobId, {
                    group: { image, subject, totalAmount },
                    member,
                });
            });

            res.json({
                message: `Email will be Sent to ${group.name} in some time`,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage = "Unable to send email, please try again later.";
            throw err;
        }
    },

    checkAndSendPaymentReminders: async () => {
        const queueName = conf.queues.queueName;

        try {
            const unPaidData =
                await GroupsModel.getGroupAndMembersForMailUnpaid();

            for (const { group, unpaidMembers } of unPaidData) {
                unpaidMembers.map(async (member) => {
                    let jobId = [
                        "UNPAID",
                        group.name,
                        member._id,
                        member.name,
                        new Date().getTime(),
                    ].join(":");

                    const emailBeeQueue = new BeeQueueHelper(queueName);

                    let { image, subject, totalAmount } = group;

                    emailBeeQueue.getOrAddJob(jobId, {
                        group: { image, subject, totalAmount },
                        member,
                    });
                });
            }
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage = "Unable to send email, please try again later.";
            throw err;
        }
    },
};

module.exports = GroupsHandler;
