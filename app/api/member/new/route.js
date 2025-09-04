import Member from "@/models/member";
import { connectDB } from "@/app/utils/database";
import nodemailer from 'nodemailer';

// Function to generate a random 4-character attendance code
const generateAttendanceCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Function to send a welcome email with the attendance code
const sendWelcomeEmail = async (email, name, attendanceCode) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: `"CCI Programming Club" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CCI Programming Club Membership Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 5px;">Welcome to CCI Programming Club!</h2>
          <p style="color: #7f8c8d; font-size: 16px;">Your membership has been officially confirmed</p>
        </div>
        
        <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; margin: 20px 0;">
          <p>Hello ${name},</p>
          <p>Thank you for joining the CCI Programming Club. We're delighted to welcome you to our community of developers and programming enthusiasts.</p>
          <p>Your unique attendance code is below:</p>
          
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 15px; text-align: center; margin: 15px 0;">
            <span style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #3498db;">${attendanceCode}</span>
          </div>
          
          <p><strong>Important:</strong> Please keep this code secure and bring it to our meetings to mark your attendance.</p>
        </div>
        
  
        
        <div style="margin-top: 25px; font-size: 14px; color: #7f8c8d;">
          <p>If you have any questions or need assistance, please don't hesitate to contact us by replying to this email.</p>
          <p>Best regards,<br>CCI Programming Club Team</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #95a5a6; text-align: center;">
          <p>This is an automated message from CCI Programming Club. Please do not reply to this email if you didn't register for our club.</p>
        </div>
      </div>
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return false;
  }
};

export const POST = async (req) => {
    const {name, stage, avatar, email, phone} = await req.json()
    console.log(name, stage, avatar, email, phone)
    
    try {
        await connectDB()
        
        // Generate attendance code
        const attendanceCode = generateAttendanceCode();
        
        // Create new member with attendance code
        const newMember = new Member({
           name,
           avatar,
           stage,
           email,
           phone,
           attendanceCode
        })
        
        // Save member to database
        await newMember.save()
        console.log(newMember)
        
        // Send welcome email with attendance code
        await sendWelcomeEmail(email, name, attendanceCode);
        
        return new Response(JSON.stringify(newMember), {status: 201})
    } catch (error) {
        console.error("Error creating member:", error);
        return new Response(JSON.stringify("Failed to create member"), {status: 500})
    }
}