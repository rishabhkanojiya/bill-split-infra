const UsersModel = require("../models/users.model");
const { EmailService } = require("../services");
const { emailConfig } = require("../services/emailService/constants");
const {
    DoesNotExistError,
    AlreadyExistError,
} = require("../utils/errors.utils");

const UsersHandler = {
    getUser: async (req, res) => {
        const { userId } = req;

        try {
            const user = await UsersModel.getUserById(userId);

            if (!user) {
                throw new DoesNotExistError("No user found");
            }

            res.json(user);
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage = "Unable to fetch user, please try again later.";
            throw err;
        }
    },
    getUsers: async (req, res) => {
        const { pageNo = 1, pageSize = 10, searchTag } = req.query;
        try {
            const result = await UsersModel.getUsers(
                pageNo - 1,
                pageSize,
                searchTag
            );

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
                "Unable to fetch users, please try again later.";
            throw err;
        }
    },
    deleteUser: async (req, res) => {
        const { userId } = req;

        try {
            const deleteCount = await UsersModel.deleteUserById(userId);

            if (!deleteCount) {
                throw new DoesNotExistError("No user found");
            }

            return res.json({
                message: "Successfully deleted user and all related data",
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to delete user, please try again later.";
            throw err;
        }
    },

    createUser: async (req, res) => {
        // const { _id: userId } = req.user;
        const data = {
            // userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        };

        try {
            const user = await UsersModel.createUser(data);

            res.json({
                message: "Created new user",
                user,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to create user, please try again later.";
            throw err;
        }
    },

    updateUser: async (req, res) => {
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };

        const { userId } = req;

        try {
            const user = await UsersModel.updateUser(userId, data);

            res.json({
                message: "Updated user",
                user,
            });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage =
                "Unable to update user, please try again later.";
            throw err;
        }
    },

    registerUser: async (req, res) => {
        try {
            const data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            };

            const user = await UsersModel.registerUser(data);

            res.json({ success: true, user });
        } catch (err) {
            throw err;
        }
    },

    loginUser: async (req, res) => {
        try {
            const data = {
                email: req.body.email,
                password: req.body.password,
            };

            const { user, token } = await UsersModel.loginUser(data);

            res.cookie("token", token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                httpOnly: false,
            });

            res.json({ success: true, user });
        } catch (error) {
            throw error;
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const data = {
                email: req.body.email,
            };

            const { user, token } = await UsersModel.forgotPassword(data);

            const emailService = new EmailService(emailConfig);

            await emailService.resetPasswordEmail(
                user,
                `http://localhost:3000/auth/reset-password/${token}`
            );

            res.json({ success: true, user });
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (req, res) => {
        try {
            const data = {
                password: req.body.password,
                token: req.body.token,
            };

            const { user } = await UsersModel.resetPassword(data);

            res.json({ success: true, user });
        } catch (error) {
            throw error;
        }
    },
    logOutUser: async (req, res) => {
        try {
            res.clearCookie("token");

            res.json({ success: true, message: "Logged out successfully." });
        } catch (err) {
            if (err.errorCode) throw err;

            err.customMessage = "Unable to fetch user, please try again later.";
            throw err;
        }
    },
};

module.exports = UsersHandler;
