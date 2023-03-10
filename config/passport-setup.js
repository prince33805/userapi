const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // option
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile.emails[0].value)
      // check if alreadt exist
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have
          console.log("user is:", currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            // displayname: profile.displayName,
            googleId: profile.id,
            fname: profile.name.givenName,
            lname: profile.name.familyName,
            email: profile.emails[0].value
          })
            .save()
            .then((newUser) => {
              console.log("new user created:" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
