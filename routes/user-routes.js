var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const usersModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt_decode = require("../middleware/jwt_decode");
const jwt = require("jsonwebtoken");

router.post("/", async function (req, res, next) {
  try {
    let { email, password, fname, lname } = req.body;
    let hashPassword = await bcrypt.hash(password, 10);
    let new_user = new usersModel({
      email,
      password: hashPassword,
      fname,
      lname,
    });

    let user = await new_user.save();
    return res.status(201).send({
      data: user,
      message: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

/* GET users listing. */
// router.get("/", async function (req, res, next) {
//   try {
//     let token = req.headers.token;
//     jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
//       if (err) return res.status(401).json({
//         message: "unautho"
//       });
//       usersModel.findOne({ _id: decoded._id }, (err, user) => {
//         if (err) return console.log(err);
//         return res.status(200).json({
//           title: 'user grabbed',
//           user: {
//             email: user.email,
//             fname: user.fname
//           }
//         })
//       });
//     });
//     //   let users = await usersModel.find();
//     //   return res.send({
//     //     data: users,
//     //     message: true,
//     //   });
//   } catch (error) {
//     return res.status(500).send({
//       message: error.message,
//       success: false,
//     });
//   }
// });

router.get("/",async function(req,res,next){
  try{
    
    let users = await usersModel.find()
    return res.send({
      data: users,
      message: true,
    })
  }catch(error){
    return res.status(500).send({
      message : error.message,
      success : false,
    })
  }
})

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "id invalid",
        success: false,
      });
    }

    let user = await usersModel.findById(id);

    return res.send({
      data: user,
      message: "get by id success ",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { email, fname, lname } =
      req.body;
    // let hashPassword = await bcrypt.hash(password, 10);
    await usersModel.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      {
        $set: {
          email,
          fname,
          lname,
        },
      }
    );
    let user = await usersModel.findById(id);
    return res.send({
      data: user,
      message: "update success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;

    await usersModel.deleteOne({ _id: mongoose.Types.ObjectId(id) });

    let user = await usersModel.find();
    return res.send({
      data: user,
      message: "Delete Success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
