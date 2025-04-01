import { Schema, model, models } from "mongoose"

const MeetingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required!"]
    },
    desc: {
        type: String,
        required: [true, "Description is required!"]
    },
    thumbnail: {
        type: String,
        required: false
    },
    gallery: [{
        type: String
    }],
    membersParticipated: [{
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }],
    active: {
        type: Boolean,
        default: false
    },
    certificates: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Meeting = models.Meeting || model("Meeting", MeetingSchema)
export default Meeting
