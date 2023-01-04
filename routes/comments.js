import express from "express";
const Com = express.Router();
import comment from "../models/comment.js";
import Posts from "../models/post.js";

Com.get("/all", async (ree, res) => {
  const dataComment = await comment.find();
  const data = dataComment.map((d) => {
    return {
      userId: d.userId,     
      postId: d.postId,
      body: d.body,
      price: d.suggestedPrice,
      //   date: data.timestamps
    };
  });
  res.send(data);
});

Com.get("/populer", async(req, res) => {
  try{
    const PostPop = await Posts.find().sort({like:-1});
    res.status(200).json(PostPop)
  } catch(err){
    res.send(err)
  }
})

export default Com;
