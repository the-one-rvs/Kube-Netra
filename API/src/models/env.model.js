import mongoose from "mongoose";
import { Schema }from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const environmentSchema = new Schema({
    ennvironmentName: {
        type: String,
        required: true,
        trim: true
    },
    environmentNumber: {
        type: Number,
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    gitRepo: {
        type: String,
        required: true
    },
    helmValuePath: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["auto", "manual"],
        required: true,
        default: "auto"
    },
    branch: {
        type: String,
        required: true
    }
}, {
    timeseries: true
})


environmentSchema.pre('save', async function(next) {
    try {
        this.environmentNumber = (await this.constructor.countDocuments({ projectId: this.projectId })) + 1;
        next();
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
});


export const Environment = mongoose.model("Environment", environmentSchema)
