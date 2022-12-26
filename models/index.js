const mongoose = require('mongoose');
require("dotenv").config();
const connect = () => {
    mongoose.connect(process.env.BASE_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    ).catch((err) => console.log(err));
  }
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error", err);
  });
  module.exports = connect;