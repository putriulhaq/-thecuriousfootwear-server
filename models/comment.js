import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    suggestedPrice: {
      type: Number,
      required: false,
    },
    like: {
      type: [String],
    },
    dislike: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comments", CommentSchema);
