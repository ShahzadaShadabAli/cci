import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    // Connect to database
    await connectDB();

    // Fetch all meetings, sorted by creation date (newest first)
    const meetings = await Meeting.find({})
      .sort({ createdAt: -1 })
      .select('title desc thumbnail active certificates')
      .lean();

    // Count members participated for each meeting
    const meetingsWithCounts = await Promise.all(meetings.map(async (meeting) => {
      const membersCount = await Meeting.findById(meeting._id)
        .select('membersParticipated')
        .then(m => m.membersParticipated.length);
      
      return {
        ...meeting,
        membersParticipated: membersCount > 0 ? membersCount : 0
      };
    }));

    // Return the meetings with no-store headers
    return new NextResponse(JSON.stringify(meetingsWithCounts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { message: "Failed to fetch meetings", error: error.message },
      { status: 500 }
    );
  }
}