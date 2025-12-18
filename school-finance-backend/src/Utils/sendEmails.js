import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, text, name, token, status) => {
  console.log("BREVO KEY" ,process.env.BREVO_API_KEY );
  console.log("FROM MAIL" ,process.env.BREVO_FROM);
  //https://lucas-model.onrender.com

  const url = `https://lucas-model.onrender.com/${
    status === "verifyEmail" ? "verify_email" : "reset_password"
  }/${token}`;

  const html1 = `
    <p>Hi ${name},</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${url}">Verify Email</a>
    <p>This link expires in ${process.env.TOKEN_EXPIRY_HOURS} hour.</p>
  `;

  const html2 = `
    <p>Hi ${name},</p>
    <p>You requested a password reset. Click the link below:</p>
    <a href="${url}">Reset Password</a>
    <p>This link expires in ${process.env.TOKEN_EXPIRY_HOURS} hour.</p>
  `;

  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY 
    );

    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: { email: process.env.BREVO_FROM },
      subject,
      htmlContent: status === "verifyEmail" ? html1 : html2,
      textContent: text,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
