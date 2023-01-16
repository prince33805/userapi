const router = require("express").Router();
const passport = require("passport");

var express = require("express");
var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const usersModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// const authorization = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return res.sendStatus(403);
//   }
//   try {
//     const data = jwt.verify(token, process.env.JWT_KEY);
//     req.email = data.email;
//     req.password = data.password;
//     return next();
//   } catch {
//     return res.sendStatus(403);
//   }
// };

router.post("/login", async function (req, res, next) {
  try {
    var { password, email } = req.body;
    var user = await usersModel.findOne({
      email: email,
    });
    if (!user) {
      return res.status(500).send({
        message: "unauthorization",
        success: false,
      });
    }
    var checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(500).send({
        message: "unauthorization",
        success: false,
      });
    }
    var {
      _id,
      email,
      password,
      fname,
      lname,
      nickname,
      age,
      graduated,
      about,
    } = user;
    const token = jwt.sign({ _id, email, password }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .send({
        data: {
          _id,
          email,
          password,
          fname,
          lname,
          nickname,
          age,
          graduated,
          about,
          token,
        },
        message: "You loged in",
        success: true,
      })
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.JWT_KEY,
      });
  } catch (err) {
    res.status(500).send({
      message: err.message,
      success: false,
    });
  }
});

//auth logout
router.get("/logout", (req, res) => {
  // res.send("logging out");
  req.logout();
  res.redirect("/");
});

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

//callback
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user)
  res.redirect("/profile");
});

module.exports = router;
