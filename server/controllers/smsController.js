const nodemailer = require('nodemailer');
const SMTPServer = require("smtp-server").SMTPServer;
const dotenv = require("dotenv");
dotenv.config();

// Create SMTP server
const server = new SMTPServer({
    onAuth(auth, session, callback) {
        if (auth.username !== process.env.NODE_MAILER_USER || auth.password !== process.env.NODE_MAILER_PASS) {
            return callback(new Error("Invalid username or password"));
        }
        callback(null, { user: auth.username });
    }
});

server.on("error", err => {
    console.log("Error %s", err.message);
});

server.listen(2525); // Using port 2525 as it's commonly used for testing SMTP

// Create transporter
const transporter = nodemailer.createTransport({
    host: "localhost", // Since we're running our own SMTP server
    port: 2525,
    secure: false,
    auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

function sendSMS(Email, otp) {
    let mailOptions = {
        from: `"InVITe" <${process.env.NODE_MAILER_USER}>`,
        to: Email,
        subject: "One Time Password - InVITe",
        html: `Please keep your OTP confidential and do not share it with anyone. The OTP will be valid for five minutes only. <br><strong>OTP: ${otp}</strong><br><br>Thank you for choosing InVITe!<br><br>If you have any questions, please contact us`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error sending email:", err);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
}

function sendTicket(Details) {
    let mailOptions = {
        from: `"InVITe" <${process.env.NODE_MAILER_USER}>`,
        to: Details.email,
        subject: `Your Online Event Pass for ${Details.event_name} - InVITe✨`,
        html: `Dear <i>${Details.name}</i>,<br><br>Thank you for registering for ${Details.event_name}! We are excited to have you join us and want to make sure that you have all the information you need to have a great time.<br><br>Your online pass has been generated and is ready for you to use. Please remember to keep this pass with you at all times during the event and do not share it with anyone else.<br><br><strong>Pass Number: ${Details.pass}</strong><br><br>Here are the details of your registration:<br>Name: ${Details.name}<br>Amount Paid: ${Details.price}<br>Address: ${Details.address1} <br> City: ${Details.city} <br> PinCode: ${Details.zip}<br><br>If you have any questions or concerns, please don't hesitate to reach out to us. We're here to help please contact us`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error sending email:", err);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
}

module.exports = {
    sendSMS,
    sendTicket,
};
