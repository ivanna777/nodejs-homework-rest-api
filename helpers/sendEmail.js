const sgMail = require('@sendgrid/mail')

const { SG_API_KEY } = process.env

sgMail.setApiKey(SG_API_KEY)

const sendEmail = async(data) => {
  const letter = { ...data, from: 'ivannakirij@gmail.com' }
  await sgMail.send(letter)
}

module.exports = sendEmail
