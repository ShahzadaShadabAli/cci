import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs/promises';

// Function to send email with certificate
async function sendCertificateEmail(member, meeting) {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Certificate image path - using a default certificate image
  const certificateImgPath = path.join(process.cwd(), 'public', 'certificate-template.png');
  
  // Read the certificate image file
  try {
    // Check if file exists (using a try/catch to handle missing file gracefully)
    await fs.access(certificateImgPath);
    
    // Add attachment if file exists

  } catch (error) {
    console.log('Certificate template not found, sending email without attachment');
  }

  // Email content
  const mailOptions = {
    from: `"Club Certificates" <${process.env.EMAIL_USER}>`,
    to: member.email,
    subject: `Your Certificate for ${meeting.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Certificate of Participation</h2>
        <p>Dear ${member.name},</p>
        <p>Thank you for participating in our meeting: <strong>${meeting.title}</strong>.</p>
        <p>We're pleased to present you with this certificate of participation.</p>
        '<p><img src="https://images.unsplash.com/photo-1742330425089-1f91d18eaa4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D" style="max-width: 100%; height: auto;" /></p>'}
        <p>We look forward to seeing you at future events!</p>
        <p>Best regards,<br>The Club Team</p>
      </div>
    `,
  };

  // Send the email
  return transporter.sendMail(mailOptions);
}

export async function POST(req, { params }) {
  try {
    const { id } = params;
    
    // Connect to database
    await connectDB();

    // Find the meeting and check if certificates already sent
    const meeting = await Meeting.findById(id)
      .populate({
        path: 'membersParticipated',
        select: 'name email avatar'
      });
    
    if (!meeting) {
      return NextResponse.json(
        { message: "Meeting not found" },
        { status: 404 }
      );
    }
    
    if (meeting.certificates) {
      return NextResponse.json(
        { message: "Certificates already sent for this meeting" },
        { status: 400 }
      );
    }
    
    // Check if there are participants
    if (!meeting.membersParticipated || meeting.membersParticipated.length === 0) {
      return NextResponse.json(
        { message: "No participants to send certificates to" },
        { status: 400 }
      );
    }
    
    // Send certificates to each participant
    const emailPromises = meeting.membersParticipated.map(member => 
      sendCertificateEmail(member, meeting)
        .catch(error => {
          console.error(`Failed to send certificate to ${member.email}:`, error);
          return { error, email: member.email };
        })
    );
    
    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    
    // Count successful emails
    const successfulEmails = results.filter(result => !result.error).length;
    
    // Mark certificates as sent
    meeting.certificates = true;
    await meeting.save();
    
    // Return success response
    return NextResponse.json({
      message: `Certificates sent to ${successfulEmails} out of ${meeting.membersParticipated.length} participants`,
      success: true
    });
    
  } catch (error) {
    console.error("Error sending certificates:", error);
    return NextResponse.json(
      { message: "Failed to send certificates", error: error.message },
      { status: 500 }
    );
  }
}
