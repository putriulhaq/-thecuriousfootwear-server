import express from "express";
const Com = express.Router();
import comment from "../models/comment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import _ from "lodash";

Com.get("/all", async (req, res) => {
  const dataComment = await comment.find();
  const data = dataComment.map((d) => {
    return {
      id: d.id,
      userId: d.userId,
      postId: d.postId,
      body: d.body,
      price: d.suggestedPrice,
      like: d.like,
      likeCount: d.like.length,
      dislike: d.dislike.length,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  });
  res.send(data);
});

Com.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId, body, suggestedPrice, createdAt } = req.body;
    const newComment = comment.create({
      userId: req.user.userId,
      postId,
      body,
      suggestedPrice,
      createdAt,
    });
    return res.status(200).send({ message: "Comment was added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

Com.put("/update/:id", authMiddleware, async (req, res) => {
  const updateComment = {
    $set: {
      body: req.body.body,
      suggestedPrice: req.body.suggestedPrice,
    },
  };
  try {
    const commentById = await comment
      .findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        updateComment,
        function (err, result) {
          if (err) {
            console.log("error disini", err);
          } else {
            console.log("hasil disini", result);
          }
        }
      )
      .clone();
    return res.status(200).json(updateComment.$set);
  } catch (err) {
    return res.status(500).json(err);
  }
});

Com.get("/popular", async (req, res) => {
  try {
    const datacomment = await comment.find().sort({ like: -1 });
    res.status(200).json(datacomment);
  } catch (err) {
    next(err);
  }
});

Com.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const commentById = await comment
      .findOneAndDelete(
        { _id: req.params.id, userId: req.user.userId },
        function (err, result) {
          if (err) {
            console.log("error disini", err);
          } else {
            console.log("Deleted comment : ", result);
          }
        }
      )
      .clone();
    res.status(200).json({ message: "Comment have been deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

Com.get("/:id", async (req, res) => {
  try {
    const commentById = await comment
      .findOne({ _id: req.params.id }, function (err, result) {
        if (err) {
          console.log("error disini", err);
        } else {
          console.log("Single comment : ", result);
        }
      })
      .clone();
    res.status(200).json(commentById);
  } catch (err) {
    res.status(500).json(err);
  }
});

Com.get("/getCommentsByPostId/:id", async (req, res) => {
  const comments = await comment.find({ postId: req.params.id });
  const data = comments.map((d) => {
    return {
      id: d.id,
      userId: d.userId,
      postId: d.postId,
      body: d.body,
      price: d.suggestedPrice,
      like: d.like,
      dislike: d.dislike,
      likeCount: d.like.length,
      // dislike: d.dislike.length,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  });
  res.status(200).send(data);
});

Com.get("/getCommentsByUserId", authMiddleware, async (req, res) => {
  const comments = await comment.find({ userId: req.user.userId });
  const data = comments.map((d) => {
    return {
      id: data.id,
      userId: d.userId,
      postId: d.postId,
      body: d.body,
      price: d.suggestedPrice,
      like: d.like,
      dislike: d.dislike,
      likeCount: d.like.length,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  });
  res.status(200).send(data);
});

Com.get("/getCommentsByMostLiked/:postId", async (req, res) => {
  const dataComment = await comment.find({ postId: req.params.postId });
  let newDataComment = [];
  dataComment.map((data, idx) => {
    newDataComment.push({
      id: data.id,
      userId: data.userId,
      postId: data.postId,
      body: data.body,
      suggestedPrice: data.suggestedPrice,
      like: data.like,
      dislike: data.dislike,
      likeCount: data.like.length,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  });

  _.mixin({
    multipleMostLiked: function (arr, key) {
      const commentGroups = _.groupBy(arr, key);
      const keys = _.keys(commentGroups);
      const mostLiked = _.max(keys);
      const mostLikedCommentGroups = commentGroups[mostLiked];
      return _.orderBy(mostLikedCommentGroups, ["suggestedPrice"], ["desc"]);
    },
  });
  const mostLikedComments = _.multipleMostLiked(newDataComment, "likeCount");
  res.status(200).send(mostLikedComments);
});

export default Com;
