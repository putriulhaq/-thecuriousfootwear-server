import express from "express";
const User = express.Router();
import Users from "../models/User.js";
import bcrypt from "bcrypt";
// import { create } from "../models/post.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import userValidate from "./validateSchema.js";

User.use(cors());

User.post("/signup", async (req, res) => {
  const result = await userValidate.validateAsync(req.body)
  Users.findOne({ email: result.email })
    .then((dataUser) => {
      if (dataUser) {
        res.status(400).json({ message: `${result.email} already exist` });
      } else {
        bcrypt.hash(result.password, 10, (err, resulthash) => {
          result.password = resulthash;

          const user = Users.create(result)
          if (user) {
            const token = jwt.sign(
              { userId: user.userId },
              process.env.JWTSECRETKEY,
              {
                expiresIn: "30 days",
              }
            );
            res.status(201).json({
              first_name: result.first_name,
              last_name: result.last_name,
              username: result.username,
              email: result.email,
              phone_number: result.phone_number,
              about: result.about,
              token
            })
          } else {
            res.status(400)
            throw new Error('Invalid user data')
          }
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
            expiresIn: "30 days",
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
