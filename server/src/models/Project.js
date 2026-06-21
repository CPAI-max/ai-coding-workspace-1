import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    workspace: {
      type: String,
      required: true,
      enum: ["javascript", "python", "website"]
    },
    description: {
      type: String,
      default: "",
      maxlength: 500
    }
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, workspace: 1, updatedAt: -1 });

export default mongoose.model("Project", projectSchema);
