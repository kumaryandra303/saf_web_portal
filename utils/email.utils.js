// Email utility
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-password'
    }
});

module.exports = {
    sendMail: function(emailData, callback) {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@saf.com',
            to: emailData.gmail,
            subject: emailData.subject,
            html: emailData.text
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Email error:', error);
                callback(error, null);
            } else {
                console.log('Email sent:', info.response);
                callback(null, info);
            }
        });
    }
};















