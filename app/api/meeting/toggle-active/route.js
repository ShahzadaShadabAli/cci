import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    // Connect to database
    await connectDB();

    // Extract meeting ID from request
    const { meetingId } = await req.json();
    
    if (!meetingId) {
      return NextResponse.json(
        { message: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Find the meeting
    const meeting = await Meeting.findById(meetingId);
    
    if (!meeting) {
      return NextResponse.json(
        { message: "Meeting not found" },
        { status: 404 }
      );
    }

    // Get current status before toggling
    const newActiveStatus = !meeting.active;
    
    // If we're activating this meeting, deactivate all others
    if (newActiveStatus) {
      await Meeting.updateMany(
        { _id: { $ne: meetingId } }, // All meetings except this one
        { active: false }
      );
    }
    
    // Toggle the active status of this meeting
    meeting.active = newActiveStatus;
    await meeting.save();

    // Return success response
    return NextResponse.json({
      message: `Meeting ${newActiveStatus ? 'activated' : 'deactivated'} successfully`,
      meeting: {
        _id: meeting._id,
        title: meeting.title,
        active: meeting.active
      }
    });
    
  } catch (error) {
    console.error("Error toggling meeting status:", error);
    return NextResponse.json(
      { message: "Failed to toggle meeting status", error: error.message },
      { status: 500 }
    );
  }
} 