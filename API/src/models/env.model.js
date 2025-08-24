import mongoose from "mongoose";
import { Schema }from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const environmentSchema = new Schema({
    environmentName: {
        type: String,
        required: true,
        trim: true
    },
    environmentNumber: {
        type: Number
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


environmentSchema.pre("validate", async function (next) {
    try {
        if (this.isNew && !this.environmentNumber) {
            const count = await this.constructor.countDocuments({ projectId: this.projectId });
            this.environmentNumber = count + 1;
        }
        next();
    } catch (error) {
        next(new ApiError(400, error?.message));
    }
});

environmentSchema.post("findOneAndDelete", async function (doc) {
    if (!doc) return;

    try {
        // STEP 1: Remove deleted env from Project
        await mongoose.model("Project").findByIdAndUpdate(
            doc.projectId,
            { $pull: { environments: doc._id } }
        );

        // STEP 2: Fetch remaining envs sorted
        const envs = await doc.constructor.find({ projectId: doc.projectId })
            .sort("environmentNumber");

        // STEP 3: Bulk reassign numbers
        const bulkOps = envs.map((env, i) => ({
            updateOne: {
                filter: { _id: env._id },
                update: { $set: { environmentNumber: i + 1 } }
            }
        }));

        if (bulkOps.length > 0) {
            await doc.constructor.bulkWrite(bulkOps);
        }

    } catch (error) {
        console.error("Error handling environment deletion:", error.message);
    }
});



export const Environment = mongoose.model("Environment", environmentSchema)
