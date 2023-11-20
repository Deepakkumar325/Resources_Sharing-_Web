const nodemailer = require('nodemailer')


SendMail = async ({ to, subject, text, html }) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: `GlaStudyshare Service <${process.env.MAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
    })
    console.log(info)
}

module.exports = SendMail;