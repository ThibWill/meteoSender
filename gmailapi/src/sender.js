const nodemailer = require("nodemailer");
const account = require("../config/account.json").account;

async function sendEmail(email, subject) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: account.email, 
      pass: account.password 
    }
  });

  const mailOptions = {
    from: 'senderbottw@gmail.com', 
    to: "thibault.willer@gmail.com", 
    subject: subject, 
    html: email
  }

  // send mail with defined transport object
  await transporter.sendMail(mailOptions, (err, data) => {
    if(err) { throw err; } 
  });
  
  return true;
}

module.exports = {
  sendEmail,
};