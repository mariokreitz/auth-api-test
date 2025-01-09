import nodemailer from "nodemailer";

const sendVerificationEmail = async (user, verificationToken) => {
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
      subject: "Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 40px; text-align: center; border-radius: 8px; width: 100%; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Please Verify Your Email</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">We just need to confirm your email address so you can start using your account.</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">To complete your registration, click the button below:</p>
            
            <a href="http://localhost:3000/auth/verify-email?token=${verificationToken}" style="display: inline-block; background-color: #6c5ce7; color: #ffffff; padding: 15px 30px; font-size: 18px; text-decoration: none; border-radius: 6px; margin-top: 30px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;">
              Verify Your Email
            </a>
            
            <p style="color: #aaa; font-size: 14px; margin-top: 20px;">If you didn’t create an account, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendVerificationEmail;
