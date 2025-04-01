import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    // Connect to database
    await connectDB();

    // Find the meeting by ID and populate the membersParticipated field
    const meeting = await Meeting.findById(id)
      .populate({
        path: 'membersParticipated',
        select: 'name avatar stage Rank email' // Select fields you want to include
      });
    
    if (!meeting) {
      return NextResponse.json(
        { message: "Meeting not found" },
        { status: 404 }
      );
    }

    // Return the meeting data with populated members
    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json(
      { message: "Failed to fetch meeting", error: error.message },
      { status: 500 }
    );
  }
}