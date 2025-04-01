import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Member from "@/models/member";
import Meeting from "@/models/meeting";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    // Connect to database
    await connectDB();
    
    // Parse request body
    const { attendanceCode, meetingId } = await req.json();
    
    // Validate input
    if (!attendanceCode || !meetingId) {
      return NextResponse.json(
        { message: "Attendance code and meeting ID are required" },
        { status: 400 }
      );
    }
    
    // Find the active meeting
    const meeting = await Meeting.findOne({ 
      _id: meetingId,
      active: true 
    });
    
    if (!meeting) {
      return NextResponse.json(
        { message: "No active meeting found with this ID" },
        { status: 404 }
      );
    }
    
    // Find the member with the matching attendance code
    const member = await Member.findOne({ attendanceCode });
    
    if (!member) {
      return NextResponse.json(
        { message: "Invalid attendance code" },
        { status: 404 }
      );
    }
    
    // Check if member already participated
    const alreadyParticipated = meeting.membersParticipated.some(
      id => id.toString() === member._id.toString()
    );
    
    if (alreadyParticipated) {
      return NextResponse.json(
        { message: "You have already marked your attendance for this meeting" },
        { status: 400 }
      );
    }
    
    // Add member to participants
    meeting.membersParticipated.push(member._id);
    await meeting.save();
    
    // Return success response
    return NextResponse.json({
      message: "Attendance marked successfully",
      memberName: member.name
    });
    
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { message: "Failed to mark attendance", error: error.message },
      { status: 500 }
    );
  }
} 