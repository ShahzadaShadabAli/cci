import { Schema, model, models } from "mongoose"

const FeedbackSchema = new Schema({
    complain: {
        type: String,
        required: [true, "Complain is required!"]
    },
    attendanceCode: {
        type: String,
        required: [true, "Attendance code is required!"],
        minLength: [4, "Attendance code must be 4 characters"],
        maxLength: [4, "Attendance code must be 4 characters"]
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    }
}, { timestamps: true })

const Feedback = models.Feedback || model("Feedback", FeedbackSchema)
export default Feedback 