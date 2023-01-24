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
    res.status(200).json(`${id}`);
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
    res.status(200).json(`${id}`);
  } catch (err) {
    return err;
  }
});

User.get("/profil/:Id", async (req, res) => {
  const { Id } = req.params;
  const dataProfil = await Users.find({ userId: Id });
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

User.put("/follow/:userId", authMiddleware, async (req, res, next) => {
  try {
    const userId = (await Users.find({ userId: req.user.userId })).map(
      (data) => data._id
    );
    const dataFollowed = await Users.find({ _id: userId });
    if (dataFollowed[0].followedUsers.includes(req.params.userId)) {
      res.status(409).send({ message: "you have been followed" });
    } else {
      await Users.findByIdAndUpdate(
        userId,
        {
          $push: { followedUsers: req.params.userId },
        },
        { new: true }
      );
      await Users.findByIdAndUpdate(
        req.params.userId,
        {
          $inc: { follower: 1 },
        },
        { new: true }
      );
      res.status(200).json(req.params.userId);
    }
  } catch (error) {
    next(error);
  }
});

User.put("/unfollow/:userId", authMiddleware, async (req, res, next) => {
  try {
    const userId = (await Users.find({ userId: req.user.userId })).map(
      (data) => data._id
    );
    await Users.findByIdAndUpdate(
      userId,
      {
        $pull: { followedUsers: req.params.userId },
      },
      { new: true }
    );
    await Users.findByIdAndUpdate(req.params.userId, {
      $inc: { follower: -1 },
    });
    res.status(200).json(req.params.userId);
  } catch (error) {
    next(error);
  }
});

User.get("/follower/:id", async (req, res, next) => {
  try {
    const dataU = await Users.find({ _id: req.params.id });
    if (dataU[0].follower < 0) {
      const follow = dataU.map((data) => {
        return {
          following: data.followedUsers.length,
          follower: 0,
        };
      });
      res.status(200).send(follow);
    } else {
      const follow = dataU.map((data) => {
        return {
          following: data.followedUsers.length,
          follower: data.follower,
        };
      });
      res.status(200).send(follow);
    }
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
    res.status(200).json(`${id}`);
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
    res.status(200).json(`${id}`);
  } catch (err) {
    return err;
  }
});

export default User;
