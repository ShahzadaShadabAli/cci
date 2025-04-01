import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/database";
import Member from "@/models/member";
import Rank from "@/models/rank";

export const POST = async (req) => {
  try {
    // Connect to database
    await connectDB();

    // Extract member ID and points from request body
    const { memberId, points } = await req.json();

    if (!memberId || points === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: memberId and points" },
        { status: 400 }
      );
    }

    // Fetch the member
    const member = await Member.findById(memberId);
    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    // Calculate new total points
    const newTotalPoints = member.Points + points;
    member.Points = newTotalPoints;

    // Get all ranks sorted by points_needed in ascending order
    const ranks = await Rank.find().sort({ points_needed: 1 });
    
    // Find the highest rank the member qualifies for and the next rank
    let newRank = member.Rank; // Default to current rank
    let nextRankPointsNeeded = null; // Store the points needed for the next rank
    
    // Find the member's new rank and the next rank's points needed
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      
      if (newTotalPoints >= rank.points_needed) {
        // This rank is achievable, update the current rank
        newRank = rank.name;
        
        // Check if there's a next rank and store its points_needed
        if (i + 1 < ranks.length) {
          nextRankPointsNeeded = ranks[i + 1].points_needed;
        } else {
          // This is the highest rank, use its own points_needed as target
          nextRankPointsNeeded = rank.points_needed;
        }
      } else {
        // Found a rank the member doesn't qualify for yet
        // This becomes the target for totalPoints
        nextRankPointsNeeded = rank.points_needed;
        break;
      }
    }
    
    // Update member's rank if it changed
    if (newRank !== member.Rank) {
      member.Rank = newRank;
    }
    
    // Set the totalPoints field to the next rank's points_needed
    member.totalPoints = nextRankPointsNeeded;

    // Save updated member
    await member.save();

    // Return the updated member data
    return NextResponse.json({
      message: "Points added successfully",
      member: {
        _id: member._id,
        name: member.name,
        Points: member.Points,
        totalPoints: member.totalPoints,
        Rank: member.Rank,
        promoted: newRank !== member.Rank
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error adding points:", error);
    return NextResponse.json(
      { message: "Failed to add points", error: error.message },
      { status: 500 }
    );
  }
}
