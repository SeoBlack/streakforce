const nodeMailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const sendEmail = async ({ to, subject, data, template }) => {
  try {
    if (
      !process.env.EMAIL_SERVICE ||
      !process.env.EMAIL_USERNAME ||
      !process.env.EMAIL_PASSWORD
    ) {
      console.log("Email service, username, and password are required");
      throw new Error("Email service, username, and password are required");
    }
    const transporter = nodeMailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const templatePath = path.join(__dirname, `${template}.html`);
    if (!sendEmail._tmpl) {
      sendEmail._tmpl = fs.readFileSync(templatePath, "utf8");
    }

    const tokens = {
      recipientName: data.recipientName ?? "",
      senderName: data.senderName ?? "",
      habitName: data.habitName ?? "",
      habitDescription: data.habitDescription ?? "",
      duration: String(data.duration ?? ""),
      startDate: data.startDate ?? "",
      endDate: data.endDate ?? "",
      resetPasswordLink: data.resetPasswordLink ?? "",
    };
    const htmlContent = sendEmail._tmpl.replace(
      /{{(\w+)}}/g,
      (_, key) => tokens[key] ?? ""
    );

    const info = await transporter.sendMail({
      from: `"StreakForce Team" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../assets/logo.png"),
          cid: "logo",
        },
      ],
    });
    console.log(`Email sent to ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email could not be sent");
  }
};
module.exports = sendEmail;
