import { connectDB } from "@/app/utils/database";
import Confirmation from "@/models/confirmation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = async () => {
    try {
        await connectDB()
        const confirmations = await Confirmation.find({})
        console.log(confirmations)
        return new Response(JSON.stringify(confirmations), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        })
    } catch (error) {
        return new Response(JSON.stringify("Failed to fetch data"), {status: 500})
    }
}
