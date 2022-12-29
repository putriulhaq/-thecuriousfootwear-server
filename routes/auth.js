import express from "express";
const User = express.Router();
import Users from "../models/User.js";
import bcrypt from "bcrypt";
// import { create } from "../models/post.js";
import cors from "cors";
import jwt from "jsonwebtoken";

User.use(cors());

User.post("/signup", async (req, res) => {
  const newData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    phone_number: req.body.phone_number,
    about: req.body.about,
    password: req.body.password,
  };

  Users.findOne({ email: req.body.email })
    .then((dataUser) => {
      if (dataUser) {
        res.status(400).json({ message: `${req.body.email} already exist` });
      } else {
        bcrypt.hash(req.body.password, 10, (err, resulthash) => {
          newData.password = resulthash;
          Users.create(newData)
            .then((user) => {
              res.status(200).json({
                message: `${newData.username} registered successfully`,
              });
            })
            .catch((err) => {
              res.send(err);
            });
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

User.post("/login", async (req, res) => {
  Users.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          { userId: user.userId },
          process.env.JWTSECRETKEY,
          {
            expiresIn: "1 days",
          }
        );
        res.json({
          message: `${user.email} login succesfully`,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
          userId: user.userId,
          token,
        });
      }
    }
  });
});

export default User;
