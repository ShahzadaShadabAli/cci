import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Return the meeting data with populated members and no-store headers
    return new NextResponse(JSON.stringify(meeting), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json(
      { message: "Failed to fetch meeting", error: error.message },
      { status: 500 }
    );
  }
}