const   nodemailer = require('nodemailer'),
        sgTransport = require('nodemailer-sendgrid-transport');

const  mailConfig = require('../config/mail.json')

const options = {
  auth: {
    api_user: mailConfig.user,
    api_key: mailConfig.pass
  }
}

exports.sendMail = async (to, subject, content) => {

  const client = await nodemailer.createTransport(sgTransport(options))

  var email = {
    from: mailConfig.mail,
    to,
    subject,
    text: content,
    html: content
  }

  let result
  try {
    result = await client.sendMail(email);
  } catch(error){
    return false
  }

  return result
}
  