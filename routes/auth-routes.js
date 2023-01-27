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
  // res.send({ user: req.user });
  // console.log(req.status)
});

// router.post("/login", async function (req, res, next) {
//   try {
//     var { password, email } = req.body;
//     var user = await usersModel.findOne({
//       email: email,
//     });
//     if (!user) {
//       return res.status(500).send({
//         message: "unauthorization",
//         success: false,
//       });
//     }
//     var checkPassword = await bcrypt.compare(password, user.password);
//     if (!checkPassword) {
//       return res.status(500).send({
//         message: "unauthorization",
//         success: false,
//       });
//     }
//     var { _id, email, password, fname, lname } = user;
//     const token = jwt.sign({ _id, email, password }, process.env.JWT_KEY, {
//       expiresIn: "1m",
//     });
//     return res.json({status:'ok',data:token})
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//       success: false,
//     });
//   }
// });

router.post("/login", async (req, res, next) => {
  usersModel.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res.status(500).json({
        title: "server error",
        error: err,
      });
    if (!user) {
      return res.status(401).json({
        title: "user not found",
        error: "invalid credentials",
      });
    }
    //incorrect password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        tite: 'login failed',
        error: 'invalid credentials'
      })
    }
    //IF ALL IS GOOD create a token and send to frontend
    let token = jwt.sign({ userId: user._id}, 'secretkey');
    return res.status(200).json({
      title: 'login sucess',
      token: token
    })
  });
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
