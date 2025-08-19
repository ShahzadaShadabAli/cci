import { connectDB } from "@/app/utils/database";
import Confirmation from "@/models/confirmation";

export const GET = async () => {
    try {
        await connectDB()
        const confirmations = await Confirmation.find({})
        console.log(confirmations)
        return new Response(JSON.stringify(confirmations), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify("Failed to fetch data"), {status: 500})
    }
}
