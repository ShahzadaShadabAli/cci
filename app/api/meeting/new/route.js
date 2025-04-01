import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";

export async function POST(req) {
  try {
    // Connect to database
    await connectDB();

    // Extract data from request body
    const { title, desc } = await req.json();
    
    // Validate required fields
    if (!title || !desc) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    // Create a new meeting record with just title and description
    const meeting = new Meeting({
      title,
      desc
    });

    // Save to database
    await meeting.save();

    // Return success response
    return NextResponse.json({
      message: "Meeting created successfully",
      meeting: {
        _id: meeting._id,
        title: meeting.title,
        desc: meeting.desc
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json( 
      { message: "Failed to create meeting", error: error.message },
      { status: 500 }
    );
  }
}
