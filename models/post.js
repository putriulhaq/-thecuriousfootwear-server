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
    // required: true,
  },
  // userId:{
  //     type: String,
  //     unique:true
  // },
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
    required: true,
  },
  condition: {
    type: String,
  },
  like:{
    type:[String]
  },
  dislike: {
    type:[String]
  },
});

export default mongoose.model('Post', PostSchema)
