import express from "express";
const Post = express.Router();
import Posts from "../models/post.js";
import {authMiddleware} from '../middleware/authMiddleware.js'

Post.post("/posts", async (req, res) => {
  try {
    const newPost = Posts.create({
      title: req.body.title,
      description: req.body.title,
      image: req.body.image,
      original_price: req.body.original_price,
      price: req.body.price,
      suggested_price: req.body.suggested_price,
      condition: req.body.condition,
      like: req.body.like,
      dislike: req.body.dislike,
    });
    return res.status(200).send({
      message: `${req.body.title} created successfully`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

Post.get("/posts", authMiddleware, async(req, res) => {
  const dataPosts = await Posts.find();
  const allPosts = dataPosts.map((data) => {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      original_price: data.original_price,
      price: data.price,
      suggested_price: data.suggested_price,
      condition: data.condition,
      like: data.like,
      dislike: data.dislike,
    };
  });
  res.send(allPosts);
});

Post.put("/post/edit/:id", async (req, res) => {
  const { id } = req.params;
  const myquery = { userId: id };
  const updateData = {
    $set: {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      original_price: req.body.original_price,
      price: req.body.price,
      suggested_price: req.body.suggested_price,
      condition: req.body.condition,
    },
  };
  const data = await Posts.updateOne(
    myquery,
    updateData,
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }
  ).clone();
  return res.status(200).json(updateData.$set);
});

Post.delete("/posts/:id", async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
      if (post.userId === req.body.userId) {
        try {
          await post.delete();
          res.status(200).json("Post has been deleted");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can delete only your post!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

// module.exports = Post;
export default Post;
