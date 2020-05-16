const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../../model/User');
const key = require('./keys').secret;

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = require('./keys').GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = require('./keys').GOOGLE_CLIENT_SECRET;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            console.log('ENTREE');
            console.log(jwt_payload);
            User.findById(jwt_payload._id).then(user => {
                console.log('aaaa');
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
          callbackURL: "/api/auth/google/callback",
      }, (accessToken, refreshToken, profile, done) => {
          User.findOne({ googleId: profile.id }).then((currentUser) => {
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
                  })
              }
            return done(null, newUser);
          });
      }
    ));

}
