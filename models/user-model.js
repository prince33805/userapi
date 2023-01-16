const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  googleId: String,
  password: String,
  fname: String,
  lname: String,
  // displayname: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
