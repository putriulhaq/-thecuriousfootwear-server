import express from "express";
const Post = express.Router();
import Posts from "../models/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

Post.post("/", authMiddleware, async (req, res) => {
  const newPost = new Posts({ userId: req.user.userId, ...req.body });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

Post.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const postsWithQuery = await Posts.find({
      title: { $regex: query, $options: "i" },
    });
    res.status(200).json(postsWithQuery);
  } catch (error) {
    console.log(error);
  }
});

Post.get("/all", async (req, res) => {
  const dataPosts = await Posts.find();
  const allPosts = dataPosts.map((data) => {
    return {
      id: data.id,
      userId: data.userId,
      title: data.title,
      description: data.description,
      image: data.image,
      original_price: data.original_price,
      price: data.price,
      suggested_price: data.suggested_price,
      condition: data.condition,
      like: data.like,
      dislike: data.dislike,
      category: data.category,
      purchase_date: data.purchase_date,
      view:data.view
    };
  });
  res.send(allPosts);
});

Post.get("/popular", async (req, res) => {
  try {
    const datapost = await Posts.find().sort({ like: -1 });
    res.status(200).json(datapost);
  } catch (err) {
    next(err);
  }
});

Post.get("/:id", async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.id);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

Post.put("/edit/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const myquery = { _id: id };
  const userId = req.user.userId;
  const datapost = await Posts.findById(id);
  if (userId == datapost.userId) {
    const updateData = {
      $set: req.body,
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
  } else {
    res.status(401).json("You can update only your post!");
  }
});

Post.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.userId == req.user.userId) {
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

Post.get("/user/:user", async (req, res) => {
  const { user } = req.params;
  const dataPosts = await Posts.find({ userId: user });
  try {
    res.status(200).json(dataPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

Post.put("/view/:idPost", async (req, res, next) => {
  try {
    console.log(req.params.idPost)
    await Posts.findByIdAndUpdate(req.params.idPost, {
      $inc: { view: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
});

export default Post;
