const router = require("express").Router();
const userModel = require("../models/user-model");

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect("/auth/login");
  } else {
    //  if logged in
    next();
  }
};

// router.get("/", async (req, res) => {
//   try {

//     // let id = req.user._id;
//     // let user = await userModel.findById(id);
//     let user = await userModel.find({email:req.user});
//     res.send({
//       message: "get success",
//       data: user,
//       success: true,
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//       success: false,
//     });
//   }
// });

// create home
router.get("/", authCheck, (req, res) => {
  res.render('profile',{user:req.user});
  //   res.send("logged in" + req.user.username);
});

module.exports = router;
