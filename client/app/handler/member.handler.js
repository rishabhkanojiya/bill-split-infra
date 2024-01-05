const MembersModel = require("../models/members.model");
const { DoesNotExistError } = require("../utils/errors.utils");

const MembersHandler = {
    getMember: async (req, res) => {
        const { userId } = req;
        const { memberId } = req.params;

        try {
            const member = await MembersModel.getMemberById({
                userId,
                memberId,
            });

            if (!member) {
                throw new DoesNotExistError("No member found");
            }

            res.json(member);
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to fetch member, please try again later.";
            throw err;
        }
    },
    getMembers: async (req, res) => {
        const { userId } = req;
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;
        try {
            const result = await MembersModel.getMembers({
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
                "Unable to fetch members, please try again later.";
            throw err;
        }
    },
    deleteMember: async (req, res) => {
        const { userId } = req;
        const { memberId } = req.params;

        try {
            const deleteCount = await MembersModel.deleteMemberById({
                userId,
                memberId,
            });

            if (!deleteCount) {
                throw new DoesNotExistError("No member found");
            }

            return res.json({
                message: "Successfully deleted member and all related data",
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to delete member, please try again later.";
            throw err;
        }
    },

    createMember: async (req, res) => {
        const { userId } = req;
        const data = {
            userId,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            paid: req.body.paid,
            amount: req.body.amount,
        };

        try {
            const member = await MembersModel.createMember(data);

            res.json({
                message: "Created new member",
                member,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to create member, please try again later.";
            throw err;
        }
    },

    updateMember: async (req, res) => {
        const { userId } = req;

        const data = {
            userId,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            paid: req.body.paid,
            amount: req.body.amount,
        };

        const { memberId } = req.params;

        try {
            const member = await MembersModel.updateMember(memberId, data);

            res.json({
                message: "Updated member",
                member,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to update member, please try again later.";
            throw err;
        }
    },
};

module.exports = MembersHandler;
