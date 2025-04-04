import Confirmation from "@/models/confirmation";
import { connectDB } from "@/app/utils/database";

export const POST = async (req) => {
    const {name, stage, avatar, email} = await req.json()
    console.log(name, stage, avatar, email)
    try {
        await connectDB()
        const newConfirmation = new Confirmation({
           name,
           avatar,
           stage,
           email,
        })
        await newConfirmation.save()
        console.log(newConfirmation)
        return new Response(JSON.stringify(newConfirmation), {status: 201})
    } catch (error) {
        return new Response(JSON.stringify("Failed to save confirmation"), {status: 500})
    }
}