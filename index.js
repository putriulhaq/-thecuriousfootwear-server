import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ConnectionStates from "mongoose";
const app = express();
import connection from "./models/index.js";
const port = 3001;
import Post from "./routes/posts.js";
import Auth from "./routes/auth.js";
import Cat from "./routes/category.js";
import Com from "./routes/comments.js";
import User from "./routes/users.js";

//db connection
ConnectionStates.set("strictQuery", false);
connection();
app.get("/", (req, res) => {
  res.send("Welcome to The Curious Footwear APIs!");
});

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000/",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use("/api/post", Post);
app.use("/api/auth", Auth);
app.use("/api/category", Cat);
app.use("/api/comment", Com);
app.use("/api/user", User);

// app.use("/api", [User]);

app.listen(port, () => {
  console.log(`Connected with port ${port}`);
});
