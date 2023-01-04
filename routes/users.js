import express from "express";
const User = express.Router();
import Post from "../models/post.js";
import Users from "../models/User.js";
import comment from "../models/comment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

User.put("/like/:postId", authMiddleware, async (req, res) => {
  const id = req.user.userId;
  const postId = req.params.postId;
  try {
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { like: id },
      $pull: { dislike: id },
    });
    res.status(200).json("The video has been likes");
  } catch (err) {
    return err;
  }
});

User.put("/dislike/:postId", authMiddleware, async (req, res) => {
  const id = req.user.userId;
  const postId = req.params.postId;
  try {
    await Post.findByIdAndUpdate(postId, {
      $addToSet: { dislike: id },
      $pull: { like: id },
    });
    res.status(200).json("The video has been dislikes");
  } catch (err) {
    return err;
  }
});

User.get("/profil/:Id", async (req, res) => {
  const { Id } = req.params;
  const dataProfil = await Users.findById({ userId: Id });
  // const data = dataProfil.map((data) => {
  //   return {
  //     userId: data.userId,
  //     first_name: data.first_name,
  //     last_name: data.last_name,
  //     username: data.username,
  //     email: data.email,
  //     phone_number: data.phone_number,
  //     about: data.about,
  //     image: data.image,
  //   };
  // });
  res.json(dataProfil);
});

User.put("/profil/edit/:id", async (req, res) => {
  const { id } = req.params;
  const myquery = { userId: id };
  const updateData = {
    $set: req.body,
  };
  const data = await Users.updateOne(
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
  return res.status(200).send({
    message: `Updated profile successfully`,
  });
});

User.put("/follow/:userId", async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { followedUsers: req.params.userId },
    });
    await User.findByIdAndUpdate(req.params.userId, {
      $inc: { follower: 1 },
    });
    res.status(200).json("Follow is successfull!");
  } catch (error) {
    next(error);
  }
});

User.put("/unfollow/:userId", async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { followedUsers: req.params.userId },
    });
    await User.findByIdAndUpdate(req.params.userId, {
      $inc: { follower: -1 },
    });
    res.status(200).json("Unfollow is successfull!");
  } catch (error) {
    next(error);
  }
});

User.put("/likeComment/:commentId", authMiddleware, async (req, res) => {
  const id = req.user.userId;
  const commentId = req.params.commentId;
  try {
    await comment.findByIdAndUpdate(commentId, {
      $addToSet: { like: id },
      $pull: { dislike: id },
    });
    res.status(200).json("Comment has been liked");
  } catch (err) {
    return err;
  }
});

User.put("/dislikeComment/:commentId", authMiddleware, async (req, res) => {
  const id = req.user.userId;
  const commentId = req.params.commentId;
  try {
    await comment.findByIdAndUpdate(commentId, {
      $addToSet: { dislike: id },
      $pull: { like: id },
    });
    res.status(200).json("Comment has been disliked");
  } catch (err) {
    return err;
  }
});

export default User;
