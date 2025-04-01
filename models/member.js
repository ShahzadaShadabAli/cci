import {Schema, model, models} from "mongoose"

const MemberSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    stage: {
        type: String,
        required: [true, "Stage is required!"]
    },
    avatar: {
        type: String,
        required: [true, "Avatar is required!"]
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    attendanceCode: {
        type: String,
        length: 4
    },
    Rank: {
        type: String,
        default: "Acolyte"
    },
    type: {
        type: String,
        default: "Member"
    },
    Points: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 100
    },
    JoiningDate: {
        type: Date,
        default: Date.now
    },
    isMember: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

const Member = models.Member || model("Member", MemberSchema)
export default Member