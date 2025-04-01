import {Schema, model, models} from "mongoose"

const RankSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    img: {
        type: String,
        required: [true, "Image is required!"]
    },
    points_needed: {
        type: Number,
        required: [true, "Points needed is required!"]
    }
})

const Rank = models.Rank || model("Rank", RankSchema)
export default Rank
