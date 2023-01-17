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

const app = express();

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


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

// set routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/register", registerRoutes);
app.use("/", indexRoutes);
// app.use("/user", verfyToken,userRoutes);
app.use("/user",userRoutes);

app.listen(3000, () => {
  console.log("app 3000");
});
