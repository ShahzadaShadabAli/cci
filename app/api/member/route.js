import { connectDB } from "@/app/utils/database";
import Member from "@/models/member";

export const GET = async () => {
    try {
        await connectDB()
        const members = await Member.find({})
        return new Response(JSON.stringify(members), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify("Failed to fetch data"), {status: 500})
    }
}