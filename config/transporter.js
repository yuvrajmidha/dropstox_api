const nodemailer = require('nodemailer')
const {transporter} = require('../settings/smtp.json')
// exporting the transporter 
module.exports = nodemailer.createTransport(transporter)
