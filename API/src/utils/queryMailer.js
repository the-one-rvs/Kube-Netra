// utils/contactMailer.js
import nodemailer from "nodemailer";

export const sendContactMail = async ({ email, msg, mailId }) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    
    const mailOptions = {
      from: `"Kube-Netra Contact" <${process.env.SMTP_USER}>`,
      to: email, 
      replyTo: mailId, 
      subject: "📩 Query (Kube-Netra)",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ddd;">
          <h2>Query Message</h2>
          <p><strong>From:</strong> ${mailId}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line;">${msg}</p>
        </div>
      `,
    };

    
    await transporter.sendMail(mailOptions);

    return true
  } catch (err) {
    console.error("❌ Mail Error:", err);
    return false
  }
};
