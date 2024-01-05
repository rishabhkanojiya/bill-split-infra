const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router({ strict: true });
const { param, body, query } = require("express-validator");
const { validate } = require("../../../utils/route.utils");
const GroupsHandler = require("../../../handler/group.handler");
const conf = require("../../../../config");
const { isAuthenticated } = require("../../../middlewares/auth.middleware");

router.get(
    "/:groupId",
    param("groupId").exists(),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.getGroup)
);

router.get(
    "/",
    query("pageNo")
        .optional()
        .isInt()
        .withMessage("Page number field should be an integer")
        .isInt({ min: 1 })
        .withMessage("Page number field should be greater than 0")
        .toInt(),
    query("pageSize")
        .optional()
        .isInt()
        .withMessage("Page size field should be an integer")
        .isInt({ min: 1 })
        .withMessage("Page size field should be greater than 0")
        .isInt({ max: 100 })
        .withMessage("Page size field should not be greater than 100")
        .toInt(),
    query("searchTag").optional(),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.getGroups)
);

router.delete(
    "/:groupId",
    param("groupId").exists(),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.deleteGroup)
);

const groupBodyValidators = [
    body("name")
        .exists()
        .withMessage("Name field should be present")
        .isString()
        .withMessage("Name field value should be a string")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "Name field value length should be between 1 to 255 characters"
        ),

    body("subject")
        .exists()
        .withMessage("subject field should be present")
        .isString()
        .withMessage("subject field value should be a string")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "subject field value length should be between 1 to 255 characters"
        ),
    body("image")
        .exists()
        .withMessage("image field should be present")
        .isString()
        .withMessage("image field value should be a string")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "image field value length should be between 1 to 255 characters"
        ),
    body("totalAmount")
        .optional({ nullable: true })
        .isFloat({ min: 1 })
        .withMessage("totalAmount field should be greater than 1")
        .toFloat(),
];

router.post(
    "/",
    ...groupBodyValidators,
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.createGroup)
);

router.patch(
    "/:groupId",
    ...groupBodyValidators,
    param("groupId").isString().withMessage("Must be a string"),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.updateGroup)
);

router.post(
    "/:groupId/add/:memberId",
    param("groupId").exists(),
    param("memberId").exists(),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.addMemberToGroup)
);

router.post(
    "/:groupId/multiple/add",
    param("groupId").exists(),
    body("memberIds").isArray().notEmpty(),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.addMultipleMemberToGroup)
);

router.delete(
    "/:groupId/remove/:memberId",
    param("groupId").exists(),
    param("memberId").exists(),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.removeMemberToGroup)
);

router.post(
    "/:groupId/sendMail",
    param("groupId").exists(),
    validate,
    isAuthenticated,
    asyncHandler(GroupsHandler.sendEmailToGroupMembers)
);

module.exports = router;
