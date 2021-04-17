const transporter = require("../config/transporter");
const senderEmail = require("../settings/smtp.json")["Sender Email"]
const senderName = require("../settings/smtp.json")["Sender Name"]

// mailing function
exports.sendMail = async (to,subject,html) => transporter.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: to, 
      subject:subject, 
      html: html
})