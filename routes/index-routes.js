const router = require("express").Router();
const mongoose = require("mongoose");
const usersModel = require("../models/user-model");

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
  // res.send("you are logged in , this is your profile " + req.user.username);
});

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect("/auth/login");
  } else {
    //  if logged in
    next();
  }
};

router.get("/profile", authCheck, (req, res) => {
  res.render("profile", { user: req.user });
  //   res.send("logged in" + req.user.username);
});
module.exports = router;
