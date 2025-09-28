import { Schema } from "mongoose";
import mongoose from "mongoose";

const patPermissionsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    patId : {
        type: Schema.Types.ObjectId,
        ref: "GithubPAT",
        required: true
    },
    type: {
        type: String,
        enum: ["create", "show", "delete", "addPATInProject", "removePATFromProject"],
        required: true
    }
})

export const PatPermissions = mongoose.model("PatPermissions", patPermissionsSchema)