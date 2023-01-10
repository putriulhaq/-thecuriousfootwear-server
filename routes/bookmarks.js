import express from "express";
const Book = express.Router();
import Bookmark from "../models/bookmark.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

Book.get("/getBookmarksByUserId", authMiddleware, async (req, res) => {
  try {
    const data = await Bookmark.find({ userId: req.user.userId });
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

Book.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId, createdAt } = req.body;
    const newBookmark = Bookmark.create({
      userId: req.user.userId,
      postId,
      createdAt,
    });
    return res
      .status(200)
      .send({ message: "Post was saved in bookmark successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

Book.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const bookmarkById = await Bookmark.findOneAndDelete(
      {
        postId: req.params.id,
        userId: req.user.userId,
      },
      function (err, result) {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("Bookmark have been removed: ", result);
        }
      }
    ).clone();
    res
      .status(200)
      .json({ message: "Bookmark have been removed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default Book;
