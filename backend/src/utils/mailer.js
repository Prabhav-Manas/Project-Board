require('dotenv').config();
const nodemailer = require("nodemailer");

// Send Email-Verification Link
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
        <html>
          <head>
            <style>
              body{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #000;
              }
              p {
                font-size: 16px;
                color: #333;
              }
              a {
                display: inline-block;
                margin: 20px 0;
                padding: 10px 20px;
                background-color: #D3F1DF;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
              }
              .footer {
                font-size: 14px;
                color: #AF1740;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class='email-container'>
              <h1>Email Verification</h1>
              <p>Please click the link below to verify your email:</p>
              <a href='${verificationLink}'>${verificationLink}</a>
              <h2 class="footer">If you didn’t request this email, please ignore it.</h2>
            </div>
          </body>
        </html>`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    console.log("Verification Email sent ✅");
  } catch (error) {
    console.log("Error in sending verification email 💥:=>", error.message);
  }
};

// Send Reset-Password Link
const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <html>
          <head>
            <style>
              body{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #000;
              }
              p {
                font-size: 16px;
                color: #222;
              }
              a {
                display: inline-block;
                margin: 20px 0;
                padding: 10px 20px;
                background-color: #D3F1DF;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
              }
              .danger {
                font-weight:bold;
                color: #AF1740;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class='email-container'>
              <h1>Reset Password</h1>
              <p>We received a request to reset your password. Click the link below to proceed:</p>
              <a href='${resetLink}'>${resetLink}</a>
              <h2><span class='danger'>WARNING!</span> If you didn’t request a password reset, you can safely ignore this email.</h2>
            </div>
          </body>
        </html>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    console.log("Reset Password Email sent ✅");
  } catch (error) {
    console.log("Error in sending reset password email 💥:=>", error.message);
  }
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
