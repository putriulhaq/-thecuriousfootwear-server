const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ConnectionStates } = require("mongoose");
const app = express();
const connection = require("./models/index");
const port = 3001;
const Post = require("./routes/posts");
const User = require("./routes/users");

//db connection
connection();
app.get("/", (req, res) => {
  res.send("Welcome to The Curious Footwear");
});

//middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api", [Post, User]);
// app.use("/api", [User]);

app.listen(port, () => {
  console.log(`Connected with port ${port}`);
});
