import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    // unique:true
  },
  original_price: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  suggested_price: {
    type: Number,
    default: 0,
  },
  condition: {
    type: String,
  },
  like: {
    type: [String],
    default: [],
  },
  dislike: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  purchase_date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
});

export default mongoose.model("Post", PostSchema);
