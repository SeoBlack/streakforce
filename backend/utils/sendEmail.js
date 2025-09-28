const nodeMailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const sendEmail = async ({ to, subject, data }) => {
  try {
    const transporter = nodeMailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const template = path.join(__dirname, "invite.html");
    let htmlContent = require("fs").readFileSync(template, "utf8");

    htmlContent = htmlContent
      .replace("{{recipientName}}", data.recipientName)
      .replace("{{senderName}}", data.senderName)
      .replace("{{habitName}}", data.habitName)
      .replace("{{habitDescription}}", data.habitDescription)
      .replace("{{duration}}", data.duration)
      .replace("{{startDate}}", data.startDate)
      .replace("{{endDate}}", data.endDate);
    const info = await transporter.sendMail({
      from: `"Habit Tracker Team" <${process.env.EMAIL_USERNAME}>`,
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
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email could not be sent");
  }
};
module.exports = sendEmail;
