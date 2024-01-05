const nodemailer = require("nodemailer");
const htmlTemplate = require("./emailTemplate");
const resetPassTemplate = require("./template/resetPassTemplate");

class EmailService {
    constructor(emailConfig) {
        this.transporter = nodemailer.createTransport(emailConfig);
    }

    async sendEmail(group, member) {
        const emailOptions = {
            from: "jordy0@ethereal.email",
            to: member.email,
            subject: group.subject,
            html: htmlTemplate(group, member),
        };

        try {
            await this.transporter.sendMail(emailOptions);
            // console.log(`Email sent to ${emailOptions.to}`);
        } catch (error) {
            throw new Error(`Error sending email: ${error}`);
        }
    }

    async resetPasswordEmail(user, link) {
        const emailOptions = {
            from: "jordy0@ethereal.email",
            to: user.email,
            subject: "Reset Password by clicking the email",
            html: resetPassTemplate(link),
        };

        try {
            await this.transporter.sendMail(emailOptions);
            console.log(`Email sent to ${emailOptions.to}`);
        } catch (error) {
            throw new Error(`Error sending email: ${error}`);
        }
    }
}

module.exports = { EmailService };
