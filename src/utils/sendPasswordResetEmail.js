import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f7fc;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .header h1 {
                color: #3498db;
              }
              .content {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
              }
              .content a {
                color: #3498db;
                text-decoration: none;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hi ${user.username},</p>
                <p>We received a request to reset your password. To proceed, click the link below:</p>
                <p>
                  <a href="http://localhost:3000/auth/reset-password?token=${resetToken}" target="_blank">
                    Reset Password
                  </a>
                </p>
                <p>If you did not request this, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Your Company. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export default sendPasswordResetEmail;
