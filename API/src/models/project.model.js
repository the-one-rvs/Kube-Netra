import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dockerImage: {
        type: String,
        required: true,
        trim: true
    },
    poolInterval: {
        type: Number,
        required: true,
        trim: true
    },
    nameOfGithubPAT: {
        type: String
    },
    imageType: {
        type: String,
        enum: ["public", "private"],
        required: true,
        default: "public"
    },
    dockerhubPAT: {
        type: String,
        validate: {
            validator: function (v) {
                if (this.imageType === "private" && (!v || v.trim() === "")) {
                return false;
                }
                return true;
            },
            message: "DockerHub PAT is required when imageType is private"
        }
    },
    dockerhubUsername: {
        type: String,
        validate: {
            validator: function (v) {
                if (this.imageType === "private" && (!v || v.trim() === "")) {
                return false;
                }
                return true;
            },
            message: "DockerHub username is required when imageType is private"
        }
    }

}, {
    timeseries: true
})

export const Project = mongoose.model("Project", projectSchema)