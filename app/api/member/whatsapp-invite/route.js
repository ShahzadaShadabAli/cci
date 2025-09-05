import Member from "@/models/member";
import { connectDB } from "@/app/utils/database";
import nodemailer from 'nodemailer';

// Function to send WhatsApp invitation email to all members
const sendWhatsAppInviteEmail = async (email, name) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransporter({
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
    subject: "Join our WhatsApp Group - CCI Programming Club",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-bottom: 5px;">Join our WhatsApp Group!</h2>
          <p style="color: #7f8c8d; font-size: 16px;">Stay connected with fellow club members</p>
        </div>
        
        <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; margin: 20px 0;">
          <p>Hello ${name},</p>
          <p>We're excited to invite you to join our official WhatsApp group for the CCI Programming Club!</p>
          <p>In our WhatsApp group, you'll be able to:</p>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Get instant updates about upcoming meetings and events</li>
            <li>Connect with fellow programming enthusiasts</li>
            <li>Share resources, tips, and coding challenges</li>
            <li>Participate in discussions and ask questions</li>
            <li>Stay informed about club announcements</li>
          </ul>
        </div>
        
        <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 20px 0; margin: 20px 0;">
          <p><strong>Join our WhatsApp group:</strong></p>
          <p>Click the button below to join our community and start connecting with your fellow club members!</p>
          
          <div style="text-align: center; margin: 15px 0;">
            <a href="https://chat.whatsapp.com/JCshPDxqmQ22uy7DZvsNSy" 
               style="display: inline-block; background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Join WhatsApp Group
            </a>
          </div>
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
    console.log(`WhatsApp invite email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`Error sending WhatsApp invite email to ${email}:`, error);
    return false;
  }
};

export const POST = async (req) => {
  try {
    await connectDB();
    
    // Get all members
    const members = await Member.find({});
    
    if (members.length === 0) {
      return new Response(JSON.stringify({ message: "No members found" }), { status: 404 });
    }
    
    // Send WhatsApp invite emails to all members
    const emailPromises = members.map(member => 
      sendWhatsAppInviteEmail(member.email, member.name)
        .catch(error => {
          console.error(`Failed to send WhatsApp invite to ${member.email}:`, error);
          return { error, email: member.email };
        })
    );
    
    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    
    // Count successful emails
    const successfulEmails = results.filter(result => !result.error).length;
    const failedEmails = results.filter(result => result.error).length;
    
    return new Response(JSON.stringify({
      message: `WhatsApp invite emails sent to ${successfulEmails} out of ${members.length} members`,
      successful: successfulEmails,
      failed: failedEmails,
      total: members.length
    }), { status: 200 });
    
  } catch (error) {
    console.error("Error sending WhatsApp invites:", error);
    return new Response(JSON.stringify({ message: "Failed to send WhatsApp invites" }), { status: 500 });
  }
};
