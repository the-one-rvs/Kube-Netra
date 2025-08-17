import mongoose from "mongoose";
import { Schema } from "mongoose";

const githubPATSchema = new Schema({
    nameOfPAT: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    githubUsername: {
        type: String,
        required: true
    },
    githubPAT: {
        type: String,
        required: true
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: "Project"
        }
    ]
})

export const GithubPAT = mongoose.model("GithubPAT", githubPATSchema)