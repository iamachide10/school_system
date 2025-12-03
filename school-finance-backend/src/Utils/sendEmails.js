import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"

dotenv.config()


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail=async(to,subject,text,name,token, status)=>{

    const verifyUrl=`http://localhost:5173/verify_email/${token}`
    const forgotPasswordUrl=`http://localhost:5173/forgot_password/${token}`

    const verifyHtml= `
      <p>Hi ${name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 1hour.</p>
    `

    const forgotPasswordHtml= `
      <p>Hi ${name},</p>
      <p>Please reset your password by clicking the link below:</p>
      <a href="${forgotPasswordUrl}">Resest Password.</a>
      <p>This link expires in 1 hour.</p>
    `
    const verifyMsg={
        to,
        from: process.env.FROM_EMAIL,
        subject,
        text,
        verifyHtml
    }
    const resetMsg={
        to,
        from: process.env.FROM_EMAIL,
        subject,
        text,
        forgotPasswordHtml
    }
    
    try{

        if(status="resetPassword"){
            console.log("Email sent successfully to ", to);
            await sgMail.send(resetMsg)
        }else if(status="verifyEmail"){            
            console.log("Email sent successfully to ", to);
            await sgMail.send(verifyMsg)
        }

    }
    catch(e){
        console.log("Error sending email to ", to, e);
        throw e
    }   
}
