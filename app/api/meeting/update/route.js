// import { NextResponse } from "next/server";
// import { connectDB } from "@/app/utils/database";
// import Meeting from "@/models/meeting";
// import { writeFile } from 'fs/promises';
// import path from 'path';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// // Function to save file to the public/uploads folder
// async function saveFile(file) {
//   try {
//     // Generate a unique filename with timestamp
//     const timestamp = Date.now();
//     const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
//     const fileName = `${timestamp}-${originalName}`;
    
//     // Define the path where the file will be saved
//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     const filePath = path.join(uploadDir, fileName);
    
//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     // Write the file to the public/uploads directory
//     await writeFile(filePath, buffer);
    
//     // Return the URL path that will be stored in the database
//     return `/uploads/${fileName}`;
//   } catch (error) {
//     console.error("Error saving file:", error);
//     throw new Error("Failed to save file");
//   }
// }

// export async function POST(req) {
//   console.log("first try")
//   try {
//     console.log("first try")
//     // Connect to database
//     await connectDB();

//     // Process the form data
//     const formData = await req.formData();
    
//     // Extract fields from form data
//     const meetingId = formData.get('meetingId');
//     const thumbnailFile = formData.get('thumbnail');
//     const galleryFiles = formData.getAll('gallery');

//     // Validate required fields
//     if (!meetingId) {
//       return NextResponse.json(
//         { message: "Meeting ID is required" },
//         { status: 400 }
//       );
//     }

//     // Find the meeting
//     const meeting = await Meeting.findById(meetingId);
    
//     if (!meeting) {
//       return NextResponse.json(
//         { message: "Meeting not found" },
//         { status: 404 }
//       );
//     }

//     // Update fields if provided
//     if (thumbnailFile && thumbnailFile.size > 0) {
//       const thumbnailUrl = await saveFile(thumbnailFile);
//       meeting.thumbnail = thumbnailUrl;
//       console.log("thumbnailUrl", thumbnailUrl);
//     }

//     if (galleryFiles && galleryFiles.length > 0) {
//       const galleryUrls = [];
//       for (const file of galleryFiles) {
//         if (file.size > 0) {
//           const fileUrl = await saveFile(file);
//           galleryUrls.push(fileUrl);
//         }
//       }
      
//       // Merge existing gallery with new uploads if any exist
//       if (meeting.gallery && meeting.gallery.length > 0) {
//         meeting.gallery = [...meeting.gallery, ...galleryUrls];
//       } else {
//         meeting.gallery = galleryUrls;
//       }
//     }

//     // Save updated meeting
//     await meeting.save();

//     // Return success response
//     return NextResponse.json({
//       message: "Meeting updated successfully",
//       meeting: {
//         _id: meeting._id,
//         title: meeting.title,
//         desc: meeting.desc,
//         thumbnail: meeting.thumbnail,
//         gallery: meeting.gallery,
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.log(error)
//     console.error("Error updating meeting:", error);
//     return NextResponse.json(
//       { message: "Failed to update meeting", error: error.message },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import { connectDB } from "@/app/utils/database";
// import Meeting from "@/models/meeting";
// import { writeFile } from 'fs/promises';
// import path from 'path';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// // Function to save file to the public/uploads folder
// async function saveFile(file) {
//   try {
//     console.log("saveFile - Starting to save file:", file?.name);
    
//     // Generate a unique filename with timestamp
//     const timestamp = Date.now();
//     const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
//     const fileName = `${timestamp}-${originalName}`;
    
//     // Define the path where the file will be saved
//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     const filePath = path.join(uploadDir, fileName);
    
//     console.log("saveFile - Upload path:", filePath);
    
//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     // Write the file to the public/uploads directory
//     await writeFile(filePath, buffer);
    
//     console.log("saveFile - File saved successfully:", fileName);
    
//     // Return the URL path that will be stored in the database
//     return `/uploads/${fileName}`;
//   } catch (error) {
//     console.error("saveFile - Error saving file:", error);
//     console.error("saveFile - Error stack:", error.stack);
//     throw new Error("Failed to save file");
//   }
// }

// export async function POST(req) {
//   console.log("POST - Request received");
//   try {
//     console.log("first try")
//     // Connect to database
//     console.log("POST - Connecting to database...");
//     await connectDB();
//     console.log("POST - Database connected");

//     // Process the form data
//     console.log("POST - Processing form data...");
//     const formData = await req.formData();
//     console.log("POST - Form data received");
    
//     // Extract fields from form data
//     const meetingId = formData.get('meetingId');
//     const thumbnailFile = formData.get('thumbnail');
//     const galleryFiles = formData.getAll('gallery');

//     console.log("POST - Extracted data:", {
//       meetingId,
//       hasThumbnail: !!thumbnailFile,
//       thumbnailSize: thumbnailFile?.size,
//       galleryCount: galleryFiles?.length
//     });

//     // Validate required fields
//     if (!meetingId) {
//       console.log("POST - Error: Meeting ID missing");
//       return NextResponse.json(
//         { message: "Meeting ID is required" },
//         { status: 400 }
//       );
//     }

//     // Find the meeting
//     console.log("POST - Finding meeting with ID:", meetingId);
//     const meeting = await Meeting.findById(meetingId);
    
//     if (!meeting) {
//       console.log("POST - Error: Meeting not found");
//       return NextResponse.json(
//         { message: "Meeting not found" },
//         { status: 404 }
//       );
//     }
//     console.log("POST - Meeting found:", meeting.title);

//     // Update fields if provided
//     if (thumbnailFile && thumbnailFile.size > 0) {
//       console.log("POST - Processing thumbnail...");
//       const thumbnailUrl = await saveFile(thumbnailFile);
//       meeting.thumbnail = thumbnailUrl;
//       console.log("thumbnailUrl", thumbnailUrl);
//     }

//     if (galleryFiles && galleryFiles.length > 0) {
//       console.log("POST - Processing gallery files...");
//       const galleryUrls = [];
//       for (const file of galleryFiles) {
//         if (file.size > 0) {
//           const fileUrl = await saveFile(file);
//           galleryUrls.push(fileUrl);
//         }
//       }
      
//       // Merge existing gallery with new uploads if any exist
//       if (meeting.gallery && meeting.gallery.length > 0) {
//         meeting.gallery = [...meeting.gallery, ...galleryUrls];
//       } else {
//         meeting.gallery = galleryUrls;
//       }
//       console.log("POST - Gallery updated, total items:", meeting.gallery.length);
//     }

//     // Save updated meeting
//     console.log("POST - Saving meeting...");
//     await meeting.save();
//     console.log("POST - Meeting saved successfully");

//     // Return success response
//     return NextResponse.json({
//       message: "Meeting updated successfully",
//       meeting: {
//         _id: meeting._id,
//         title: meeting.title,
//         desc: meeting.desc,
//         thumbnail: meeting.thumbnail,
//         gallery: meeting.gallery,
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.log(error)
//     console.error("POST - ERROR CAUGHT:");
//     console.error("Error type:", error.constructor.name);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
//     return NextResponse.json(
//       { message: "Failed to update meeting", error: error.message },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import { connectDB } from "@/app/utils/database";
// import Meeting from "@/models/meeting";
// import { writeFile } from 'fs/promises';
// import path from 'path';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// // Function to save file to the public/uploads folder
// async function saveFile(file) {
//   console.log("saveFile - FUNCTION CALLED");
//   console.log("saveFile - file object:", file);
//   console.log("saveFile - file type:", typeof file);
//   console.log("saveFile - file instanceof File:", file instanceof File);
  
//   try {
//     console.log("saveFile - Starting to save file:", file?.name);
//     console.log("saveFile - File size:", file?.size);
//     console.log("saveFile - File type:", file?.type);
    
//     if (!file) {
//       throw new Error("File is null or undefined");
//     }
    
//     if (!file.name) {
//       throw new Error("File has no name property");
//     }
    
//     // Generate a unique filename with timestamp
//     const timestamp = Date.now();
//     console.log("saveFile - Timestamp:", timestamp);
    
//     const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
//     console.log("saveFile - Original name processed:", originalName);
    
//     const fileName = `${timestamp}-${originalName}`;
//     console.log("saveFile - Final filename:", fileName);
    
//     // Define the path where the file will be saved
//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     const filePath = path.join(uploadDir, fileName);
    
//     console.log("saveFile - Upload dir:", uploadDir);
//     console.log("saveFile - Full file path:", filePath);
    
//     // Convert file to buffer
//     console.log("saveFile - Converting to arrayBuffer...");
//     const bytes = await file.arrayBuffer();
//     console.log("saveFile - ArrayBuffer size:", bytes.byteLength);
    
//     console.log("saveFile - Converting to Buffer...");
//     const buffer = Buffer.from(bytes);
//     console.log("saveFile - Buffer length:", buffer.length);
    
//     // Write the file to the public/uploads directory
//     console.log("saveFile - Writing file to disk...");
//     await writeFile(filePath, buffer);
    
//     console.log("saveFile - File saved successfully:", fileName);
    
//     // Return the URL path that will be stored in the database
//     return `/uploads/${fileName}`;
//   } catch (error) {
//     console.error("saveFile - ERROR DETAILS:");
//     console.error("saveFile - Error name:", error.name);
//     console.error("saveFile - Error message:", error.message);
//     console.error("saveFile - Error code:", error.code);
//     console.error("saveFile - Error stack:", error.stack);
//     console.error("saveFile - Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
//     throw new Error("Failed to save file: " + error.message);
//   }
// }

// export async function POST(req) {
//   console.log("========================================");
//   console.log("POST - Request received at:", new Date().toISOString());
//   console.log("POST - Request URL:", req.url);
//   console.log("POST - Request method:", req.method);
//   console.log("========================================");
//   try {
//     console.log("first try")
//     // Connect to database
//     console.log("POST - Connecting to database...");
//     await connectDB();
//     console.log("POST - Database connected");

//     // Process the form data
//     console.log("POST - Processing form data...");
//     const formData = await req.formData();
//     console.log("POST - Form data received");
    
//     // Extract fields from form data
//     const meetingId = formData.get('meetingId');
//     const thumbnailFile = formData.get('thumbnail');
//     const galleryFiles = formData.getAll('gallery');

//     console.log("POST - Extracted data:", {
//       meetingId,
//       hasThumbnail: !!thumbnailFile,
//       thumbnailSize: thumbnailFile?.size,
//       galleryCount: galleryFiles?.length
//     });

//     // Validate required fields
//     if (!meetingId) {
//       console.log("POST - Error: Meeting ID missing");
//       return NextResponse.json(
//         { message: "Meeting ID is required" },
//         { status: 400 }
//       );
//     }

//     // Find the meeting
//     console.log("POST - Finding meeting with ID:", meetingId);
//     const meeting = await Meeting.findById(meetingId);
    
//     if (!meeting) {
//       console.log("POST - Error: Meeting not found");
//       return NextResponse.json(
//         { message: "Meeting not found" },
//         { status: 404 }
//       );
//     }
//     console.log("POST - Meeting found:", meeting.title);

//     // Update fields if provided
//     if (thumbnailFile && thumbnailFile.size > 0) {
//       console.log("POST - Processing thumbnail...");
//       const thumbnailUrl = await saveFile(thumbnailFile);
//       meeting.thumbnail = thumbnailUrl;
//       console.log("thumbnailUrl", thumbnailUrl);
//     }

//     if (galleryFiles && galleryFiles.length > 0) {
//       console.log("POST - Processing gallery files...");
//       const galleryUrls = [];
//       for (const file of galleryFiles) {
//         if (file.size > 0) {
//           const fileUrl = await saveFile(file);
//           galleryUrls.push(fileUrl);
//         }
//       }
      
//       // Merge existing gallery with new uploads if any exist
//       if (meeting.gallery && meeting.gallery.length > 0) {
//         meeting.gallery = [...meeting.gallery, ...galleryUrls];
//       } else {
//         meeting.gallery = galleryUrls;
//       }
//       console.log("POST - Gallery updated, total items:", meeting.gallery.length);
//     }

//     // Save updated meeting
//     console.log("POST - Saving meeting...");
//     await meeting.save();
//     console.log("POST - Meeting saved successfully");

//     // Return success response
//     return NextResponse.json({
//       message: "Meeting updated successfully",
//       meeting: {
//         _id: meeting._id,
//         title: meeting.title,
//         desc: meeting.desc,
//         thumbnail: meeting.thumbnail,
//         gallery: meeting.gallery,
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.log(error)
//     console.error("POST - ERROR CAUGHT:");
//     console.error("Error type:", error.constructor.name);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
//     return NextResponse.json(
//       { message: "Failed to update meeting", error: error.message },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Meeting from "@/models/meeting";
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file to Cloudinary
async function uploadToCloudinary(file, folder = "meetings") {
  console.log("uploadToCloudinary - FUNCTION CALLED");
  console.log("uploadToCloudinary - file object:", file);
  console.log("uploadToCloudinary - file name:", file?.name);
  
  try {
    console.log("uploadToCloudinary - Starting to upload file:", file?.name);
    console.log("uploadToCloudinary - File size:", file?.size);
    console.log("uploadToCloudinary - File type:", file?.type);
    
    if (!file) {
      throw new Error("File is null or undefined");
    }
    
    if (!file.name) {
      throw new Error("File has no name property");
    }
    
    // Convert file to buffer
    console.log("uploadToCloudinary - Converting to arrayBuffer...");
    const bytes = await file.arrayBuffer();
    console.log("uploadToCloudinary - ArrayBuffer size:", bytes.byteLength);
    
    console.log("uploadToCloudinary - Converting to Buffer...");
    const buffer = Buffer.from(bytes);
    console.log("uploadToCloudinary - Buffer length:", buffer.length);
    
    // Upload to Cloudinary using upload stream
    console.log("uploadToCloudinary - Uploading to Cloudinary...");
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
          // Optional: Add more options
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("uploadToCloudinary - Upload error:", error);
            reject(new Error("Cloudinary upload failed: " + error.message));
          } else {
            console.log("uploadToCloudinary - Upload successful");
            console.log("uploadToCloudinary - Secure URL:", result.secure_url);
            console.log("uploadToCloudinary - Public ID:", result.public_id);
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      );
      
      // Write buffer to upload stream
      uploadStream.end(buffer);
    });
    
  } catch (error) {
    console.error("uploadToCloudinary - ERROR DETAILS:");
    console.error("uploadToCloudinary - Error name:", error.name);
    console.error("uploadToCloudinary - Error message:", error.message);
    console.error("uploadToCloudinary - Error stack:", error.stack);
    throw new Error("Failed to upload file to Cloudinary: " + error.message);
  }
}

export async function POST(req) {
  console.log("========================================");
  console.log("POST - Request received at:", new Date().toISOString());
  console.log("POST - Request URL:", req.url);
  console.log("POST - Request method:", req.method);
  console.log("========================================");
  
  try {
    console.log("POST - Starting process");
    
    // Connect to database
    console.log("POST - Connecting to database...");
    await connectDB();
    console.log("POST - Database connected");

    // Process the form data
    console.log("POST - Processing form data...");
    const formData = await req.formData();
    console.log("POST - Form data received");
    
    // Extract fields from form data
    const meetingId = formData.get('meetingId');
    const thumbnailFile = formData.get('thumbnail');
    const galleryFiles = formData.getAll('gallery');

    console.log("POST - Extracted data:", {
      meetingId,
      hasThumbnail: !!thumbnailFile,
      thumbnailSize: thumbnailFile?.size,
      galleryCount: galleryFiles?.length
    });

    // Validate required fields
    if (!meetingId) {
      console.log("POST - Error: Meeting ID missing");
      return NextResponse.json(
        { message: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Find the meeting
    console.log("POST - Finding meeting with ID:", meetingId);
    const meeting = await Meeting.findById(meetingId);
    
    if (!meeting) {
      console.log("POST - Error: Meeting not found");
      return NextResponse.json(
        { message: "Meeting not found" },
        { status: 404 }
      );
    }
    console.log("POST - Meeting found:", meeting.title);

    // Update thumbnail if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      console.log("POST - Processing thumbnail...");
      const uploadResult = await uploadToCloudinary(thumbnailFile, "meetings/thumbnails");
      meeting.thumbnail = uploadResult.url;
      // Optionally store publicId for later deletion
      meeting.thumbnailPublicId = uploadResult.publicId;
      console.log("POST - Thumbnail URL:", uploadResult.url);
    }

    // Update gallery if provided
    if (galleryFiles && galleryFiles.length > 0) {
      console.log("POST - Processing gallery files...");
      const galleryUrls = [];
      const galleryPublicIds = [];
      
      for (const file of galleryFiles) {
        if (file.size > 0) {
          const uploadResult = await uploadToCloudinary(file, "meetings/gallery");
          galleryUrls.push(uploadResult.url);
          galleryPublicIds.push(uploadResult.publicId);
        }
      }
      
      // Merge existing gallery with new uploads if any exist
      if (meeting.gallery && meeting.gallery.length > 0) {
        meeting.gallery = [...meeting.gallery, ...galleryUrls];
      } else {
        meeting.gallery = galleryUrls;
      }
      
      // Optionally store public IDs
      if (meeting.galleryPublicIds && meeting.galleryPublicIds.length > 0) {
        meeting.galleryPublicIds = [...meeting.galleryPublicIds, ...galleryPublicIds];
      } else {
        meeting.galleryPublicIds = galleryPublicIds;
      }
      
      console.log("POST - Gallery updated, total items:", meeting.gallery.length);
    }

    // Save updated meeting
    console.log("POST - Saving meeting...");
    await meeting.save();
    console.log("POST - Meeting saved successfully");

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
    console.error("POST - ERROR CAUGHT:");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { message: "Failed to update meeting", error: error.message },
      { status: 500 }
    );
  }
}