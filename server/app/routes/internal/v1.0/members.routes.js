const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { param, body, query } = require("express-validator");
const { validate } = require("../../../utils/route.utils");
const MembersHandler = require("../../../handler/member.handler");
const conf = require("../../../../config");
const { isAuthenticated } = require("../../../middlewares/auth.middleware");

router.get(
    "/:memberId",
    param("memberId").exists(),
    validate,
    isAuthenticated,
    asyncHandler(MembersHandler.getMember)
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
    asyncHandler(MembersHandler.getMembers)
);

router.delete(
    "/:memberId",
    param("memberId").exists(),
    validate,
    isAuthenticated,
    asyncHandler(MembersHandler.deleteMember)
);

const memberBodyValidators = [
    body("name")
        .exists()
        .withMessage("Name field should be present")
        .isString()
        .withMessage("Name field value should be a string")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "Name field value length should be between 1 to 255 characters"
        ),
    body("email")
        .exists()
        .withMessage("email field should be present")
        .isString()
        .withMessage("email field value should be a string")
        .isEmail()
        .withMessage("invalid email")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "email field value length should be between 1 to 255 characters"
        ),
    body("paid")
        .optional({ nullable: true })
        .isBoolean()
        .withMessage("paid field value should be a boolean value"),
    body("mobile")
        .optional({ nullable: true })
        .isMobilePhone()
        .withMessage("invalid mobile number"),
    body("amount")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("amount field should be greater than 1")
        .toInt(),
];

router.post(
    "/",
    ...memberBodyValidators,
    validate,
    isAuthenticated,
    asyncHandler(MembersHandler.createMember)
);

router.patch(
    "/:memberId",
    ...memberBodyValidators,
    param("memberId").isString().withMessage("Must be a string"),
    validate,
    isAuthenticated,
    asyncHandler(MembersHandler.updateMember)
);

module.exports = router;
