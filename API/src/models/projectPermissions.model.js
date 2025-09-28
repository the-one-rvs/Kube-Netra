import mongoose, { Schema } from "mongoose";

const projectPermissionsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    type: {
        type: String,
        enum: ["show", "edit", "workflow", "delete"],
        required: true
    }
})

export const ProjectPermissions = mongoose.model ("ProjectPermissions", projectPermissionsSchema)