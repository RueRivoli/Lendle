const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../../model/User');
const key = require('./keys').secret;
var cookieParser = require('cookie-parser');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = require('./keys').GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = require('./keys').GOOGLE_CLIENT_SECRET;


const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const FACEBOOK_APP_ID = require('./keys').FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = require('./keys').FACEBOOK_APP_SECRET;


var cookieExtractor = function(req) {
  var token = null;
  if (req && req.headers && req.headers.authorization) token = req.headers.authorization.split('Bearer ')[1]
  if (req && req.headers && req.headers.cookie) token = req.headers.cookie.split('jwt=')[1]
  return token;
};

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = key;
module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            // console.log('Resultat jwt_payload');
            // console.log(jwt_payload);
            // console.log('OPTS');
            // console.log(jwt_payload);
            User.findById(jwt_payload._id).then(user => {
                if (user) return done(null, user)
                return done(null, false);
            }).catch(err => {
                console.log(err)
            });
}))

    // passport.use(
    //     new GoogleStrategy({
    //       clientID: GOOGLE_CLIENT_ID,
    //       clientSecret: GOOGLE_CLIENT_SECRET,
    //       callbackURL: "/api/auth/google/callback",
    //       passReqToCallback: true
    //   }, (accessToken, refreshToken, profile, done) => {
    //       User.findOne({ googleId: profile.id }).then((currentUser) => {
    //         console.log('GOOGLE STRATEGY');
    //         console.log(currentUser);
    //           if (currentUser) {
    //               done(null, currentUser);
    //           } else {
    //               newUser = new User();
    //               newUser.firstname = profile.name.givenName,
    //               newUser.lastname = profile.name.familyName,
    //               newUser.mail = profile._json.mail,
    //               newUser.isVerified = 'true',
    //               newUser.language = profile._json.locale,
    //               newUser.googleId = profile.profileId
    //               newUser.save().then((newUser) => {
    //                 //   console.log('new user created:' + newUser);
    //               })
    //           }
    //         return done(null, newUser);
    //       });
    //   }
    // ));

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log('DONNEES RECUPEREES');
        // console.log(accessToken);
        // console.log(refreshToken);
        // console.log(profile);
        User.findOne({ fbId: profile.id }).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser);
            } else {
                newUser = new User();
                newUser.firstname = profile.name.givenName,
                newUser.isVerified = 'true',
                newUser.lastname = profile.name.familyName,
                newUser.language = profile._json.locale,
                newUser.googleId = profile.profileId
                newUser.save().then((newUser) => {
                  //   console.log('new user created:' + newUser);
                });
            }
          return done(null, newUser);
      });
    }))};
