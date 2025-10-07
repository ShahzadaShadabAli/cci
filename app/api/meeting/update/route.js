import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";
import { writeFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Function to save file to the public/uploads folder
async function saveFile(file) {
  try {
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
    const fileName = `${timestamp}-${originalName}`;
    
    // Define the path where the file will be saved
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write the file to the public/uploads directory
    await writeFile(filePath, buffer);
    
    // Return the URL path that will be stored in the database
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
  }
}

export async function POST(req) {
  try {
    console.log("first try")
    // Connect to database
    await connectDB();

    // Process the form data
    const formData = await req.formData();
    
    // Extract fields from form data
    const meetingId = formData.get('meetingId');
    const thumbnailFile = formData.get('thumbnail');
    const galleryFiles = formData.getAll('gallery');

    // Validate required fields
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

    // Update fields if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailUrl = await saveFile(thumbnailFile);
      meeting.thumbnail = thumbnailUrl;
      console.log("thumbnailUrl", thumbnailUrl);
    }

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryUrls = [];
      for (const file of galleryFiles) {
        if (file.size > 0) {
          const fileUrl = await saveFile(file);
          galleryUrls.push(fileUrl);
        }
      }
      
      // Merge existing gallery with new uploads if any exist
      if (meeting.gallery && meeting.gallery.length > 0) {
        meeting.gallery = [...meeting.gallery, ...galleryUrls];
      } else {
        meeting.gallery = galleryUrls;
      }
    }

    // Save updated meeting
    await meeting.save();

    // Return success response
    return NextResponse.json({
      message: "Meeting updated successfully",
      meeting: {
        _id: meeting._id,
        title: meeting.title,
        desc: meeting.desc,
        thumbnail: meeting.thumbnail,
        gallery: meeting.gallery,
      }
    }, { status: 200 });

  } catch (error) {
    console.log(error)
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { message: "Failed to update meeting", error: error.message },
      { status: 500 }
    );
  }
}
