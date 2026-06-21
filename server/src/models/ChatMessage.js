import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant"]
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

chatMessageSchema.index({ project: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
