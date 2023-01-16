const router = require("express").Router();
const mongoose = require('mongoose')
const usersModel = require('../models/user-model')

const bcrypt = require('bcrypt')

router.get("/" ,(req, res) => {
    res.render('register',{
        user:req.user
    })
    // res.send("you are logged in , this is your profile " + req.user.username);
});

router.post("/",async function(req,res,next){
    try{
      let {email,password,fname,lname} =req.body
      let hashPassword = await bcrypt.hash(password,10)
      let new_user = new usersModel({
        email,
        password : hashPassword,
        fname,
        lname,
      })
      
      let user = await new_user.save()
      return res.status(201).send({
        data: user,
        message: true,
      })
    }catch(error){
      return res.status(400).send({
        message : error.message,
        success : false,
      })
    }
  })

module.exports = router;
