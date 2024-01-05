const config = require("../../../config");

const emailType = config.email.emailType;

const ZohoEmailConfig = {
    host: "smtp.zoho.in",
    port: 465, // or 587 if TLS/STARTTLS is enabled
    secure: true,
    auth: {
        user: config.email.id,
        pass: config.email.token,
    },
};

const GmailEmailConfig = {
    service: "gmail",
    auth: {
        user: config.email.id,
        pass: config.email.token,
    },
};

const TestEmailConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: config.email.id,
        pass: config.email.token,
    },
};

const SelectedMail = {
    zoho: ZohoEmailConfig,
    gmail: GmailEmailConfig,
    test: TestEmailConfig,
};

module.exports = { emailConfig: SelectedMail[emailType] };
