const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");

var cookieParser = require("cookie-parser");
const passportSetup = require("./config/passport-setup");
const passport = require("passport");

const verfyToken = require("./middleware/jwt_decode");
const userRoutes = require("./routes/user-routes");
const indexRoutes = require("./routes/index-routes");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const registerRoutes = require("./routes/register-routes");

const jwt = require("jsonwebtoken");

const usersModel = require("./models/user-model");

const app = express();

var cors = require('cors');
app.use(cors());

app.use(express.static(__dirname + "/public"));

// set engine
app.set("view engine", "ejs");

app.use(cookieParser());

app.use(
  cookieSession({
    // maxAge: 1000,
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect mongodb
mongoose
  .connect(keys.mongodb.dbURI, { useNewUrlParser: true })
  .then(console.log(`connected ${keys.mongodb.dbURI}`))
  .catch((err) => console.log(err));

app.use(express.json());

app.use(function (req, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Authorization,Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.options('*', function (req,res) { res.sendStatus(200); });
// set routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/register", registerRoutes);
app.use("/", indexRoutes);
// app.use("/user", verfyToken,userRoutes);
app.use("/crud",userRoutes);
app.get("/user", (req, res, next) => {
  let token = req.headers.token; //token
  // console.log(token);
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "unauthorized",
      });
    //token is valid
    usersModel.findOne({ _id: decoded.userId }, (err, user) => {
      if (err) return console.log(err);
      return res.status(200).json({
        title: "user grabbed",
        user: {
          email: user.email,
          fname: user.fname,
        },
      });
    });
  });
});

app.listen(3000, () => {
  console.log("app port 3000");
});
