const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
const { ConnectionStates } = require("mongoose");
const app = express();
const connection = require("./models/index");
const port = 3001;

//db connection
connection();
app.get('/', (req, res) => {
    res.send('Welcome to The Curious Footwear')
})

app.listen(port, () => {
  console.log(`Connected with port ${port}`);
});
