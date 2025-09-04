import {Schema, model, models} from "mongoose"

const ConfirmationSchema = new Schema({
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
    phone: {
        type: String,
        required: false,
    },
}, { timestamps: true })

const Confirmation = models.Confirmation || model("Confirmation", ConfirmationSchema)
export default Confirmation