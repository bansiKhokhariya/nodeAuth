const nodemailer = require('nodemailer');

const sendWelcomeEmail = (email, username) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: "mariah.harvey24@ethereal.email", // generated ethereal user
            pass: 'H2hPbx7mju3SMXmV3R', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: `"Bansi Khokhariya 👻" <mariah.harvey24@ethereal.email>`, // sender address
        to: email, // list of receivers
        subject: "welcome E-Mail", // Subject line
        text: `Welcome to the app, ${username}. Let me know how you get along with the app.`,
        html: `<b>Welcome to the app, ${username}. Let me know how you get along with the app.</b>`, // html body
    });

}

module.exports = {
    sendWelcomeEmail,
}