import express from "express";
const User = express.Router();
import Post from "../models/post.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

User.put("/like/:postId", authMiddleware, async(req, res) => {
        const id = req.user.userId
        const postId = req.params.postId
    try{
        await Post.findByIdAndUpdate(postId, {
            $addToSet: {like: id},
            $pull: {dislike:id}
        })
        res.status(200).json("The video has been likes")

    } catch(err) {
        return(err)
    }
})

User.put("/dislike/:postId", authMiddleware, async(req, res) => {
    const id = req.user.userId
    const postId = req.params.postId
try{
    await Post.findByIdAndUpdate(postId, {
        $addToSet: {dislike: id},
        $pull: {like:id}
    })
    res.status(200).json("The video has been dislikes")

} catch(err) {
    return(err)
}
})

export default User;