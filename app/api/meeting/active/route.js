import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Find the first meeting where active is true
    const meeting = await Meeting.findOne({ active: true })
      .sort({ createdAt: -1 }) // Get the most recently created active meeting if multiple are active
      .select('_id title desc'); // Select only necessary fields

    // Return the meeting data or null if none found with no-store headers
    return new NextResponse(JSON.stringify({
      meeting: meeting || null,
      message: meeting ? "Active meeting found" : "No active meeting found"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    console.error("Error fetching active meeting:", error);
    return NextResponse.json(
      { message: "Failed to fetch active meeting", error: error.message },
      { status: 500 }
    );
  }
}
