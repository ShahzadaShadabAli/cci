import { connectDB } from "@/app/utils/database";
import Member from "@/models/member";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = async () => {
    try {
        await connectDB()
        const members = await Member.find({})
        return new Response(JSON.stringify(members), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        })
    } catch (error) {
        return new Response(JSON.stringify("Failed to fetch data"), {status: 500})
    }
}