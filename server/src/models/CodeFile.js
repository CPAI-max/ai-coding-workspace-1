import mongoose from "mongoose";

const codeFileSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    path: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

codeFileSchema.index({ project: 1, path: 1 }, { unique: true });

export default mongoose.model("CodeFile", codeFileSchema);
