import { connectDB } from "@/app/utils/database";
import Feedback from "@/models/feedback";
import Member from "@/models/member";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        
        const { complain, attendanceCode } = await req.json();
        
        if (!complain || !attendanceCode) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (attendanceCode.length !== 4) {
            return NextResponse.json(
                { message: "Attendance code must be 4 characters" },
                { status: 400 }
            );
        }

        // Find member with matching attendance code
        const member = await Member.findOne({ attendanceCode });
        
        if (!member) {
            return NextResponse.json(
                { message: "Invalid attendance code. Please check and try again." },
                { status: 400 }
            );
        }

        const feedback = await Feedback.create({
            complain,
            attendanceCode,
            member: member._id
        });

        return NextResponse.json(feedback, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        
        const feedbacks = await Feedback.find({})
            .populate('member', 'name avatar') // Only get name and avatar from member
            .sort({ createdAt: -1 }); // Sort by latest first
        
        return NextResponse.json(feedbacks);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch feedbacks" },
            { status: 500 }
        );
    }
} 