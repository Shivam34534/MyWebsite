import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },

});

// Function to send email
const sendEmail = async (to, subject, body) => {
    const response = await transporter.sendMail({
        from: process.env.SENDER_EMAIL, // sender address
        to, // list of receivers
        subject, // Subject line
        html: body, // html body
    })
    return response;
}

export default sendEmail