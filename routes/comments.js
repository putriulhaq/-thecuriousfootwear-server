import express from "express";
const Com = express.Router();
import comment from "../models/comment.js";

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

export default Com;
