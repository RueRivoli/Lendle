const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../../model/User');
const key = require('./keys').secret;
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = require('./keys').GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = require('./keys').GOOGLE_CLIENT_SECRET;
// const GOOGLE_CLIENT_ID = '822102734691-o4mdd9up7bc0va8c0qc2615gnhm7fpc6.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET = 'aSyRuWPwFjt1ffgNblERX_5f';



const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const FACEBOOK_APP_ID = require('./keys').FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = require('./keys').FACEBOOK_APP_SECRET;


// var cookieExtractor = function(req) {
//   var token = null;
//   if (req && req.headers && req.headers.authorization) token = req.headers.authorization.split('Bearer ')[1]
//   if (req && req.headers && req.headers.cookie) token = req.headers.cookie.split('jwt=')[1]
//   return token;
// };

const opts = {};
// opts.jwtFromRequest = cookieExtractor;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();


opts.secretOrKey = key;
module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            console.log('Resultat jwt_payload');
            console.log(jwt_payload);
            User.findById(jwt_payload._id).then(user => {
                if (user) return done(null, user)
                return done(null, false);
            }).catch(err => {
                console.log(err)
            });
}))

    passport.use(
        new GoogleStrategy({
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: "http://localhost:5000/api/auth/google/callback",
          passReqToCallback: true
      }, (req, accessToken, refreshToken, profile, done) => {
        console.log('Callback passport Google Oauth');
        console.log('Profile :');
        console.log(profile);
        console.log('Profile  ID:');
        console.log(profile.id);
          User.findOne({ googleId: profile.id }).then((currentUser) => {
            console.log('Current User');
            console.log(currentUser);
              if (currentUser) {
                console.log('FIND google id');
                  return done(null, currentUser);
              } else {
                console.log("CREATION NEW USER");
                  newUser = new User();
                  newUser.googleId = profile.id,
                  newUser.username = profile.displayName,
                  newUser.firstname = profile.name.givenName,
                  newUser.lastname = profile.name.familyName,
                  newUser.mail = profile.emails.value,
                  newUser.isVerified = true,
                  newUser.profilePicture = profile.photos[0].value,
                  console.log('New User');
                  console.log(newUser);
                  newUser.save().then((newUser) => {
                      console.log('new user created:' + newUser);
                  })
              }
            return done(null, newUser);
          });
          // return done(null, {});
      }
    ));

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
        console.log('DONNEES RECUPEREES');
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        console.log('PROFILE ID');
        console.log(profile.id);
        User.findOne({ facebookId: profile.id }).then((currentUser) => {
          console.log('THERE');
          console.log(currentUser);
            if (currentUser) {
              console.log('exist');
                return done(null, currentUser);
            } else {
              console.log('no current User')
                newUser = new User();
                newUser.facebookId = profile.id;
                if (profile.name && profile.name.familyName) {
                  newUser.lastname = profile.name.familyName
                }
                if (profile.name && profile.name.givenName) {
                  newUser.firstname = profile.name.givenName
                }
                if (!profile.name.familyName || !profile.name.givenName) {
                  if (profile.username) newUser.username = profile.username
                  else if (profile.displayName) newUser.username = profile.displayName
                } else newUser.username = newUser.firstname + ' ' + newUser.lastname
                newUser.isVerified = 'true',
                newUser.profilePicture = profile.photos[0].value;
                console.log('NEW USER');
                console.log(newUser);
                newUser.save().then((newUser) => {
                    console.log('new user created:' + newUser);
                });
                return done(null, newUser);
            }
      });
      // return done(null, {});
    }))};
