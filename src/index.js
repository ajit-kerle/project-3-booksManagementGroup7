const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const route=require('./routes/route')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://radon-AnandSharma:Anand570@cluster0.riu1k.mongodb.net/group7Database?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB is Connected."))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express is running on port " + (process.env.PORT || 3000));
});
