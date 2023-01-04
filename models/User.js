import mongoose from "mongoose";
import inc from 'mongoose-sequence';
const autoIncrement = inc(mongoose);

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
  },
  about: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  follower: {
    type: Number,
    default: 0
  },
  followedUsers: {
    type: [String]
  },
});

userSchema.plugin(autoIncrement, { inc_field: "userId" });
export default mongoose.model("User", userSchema);
