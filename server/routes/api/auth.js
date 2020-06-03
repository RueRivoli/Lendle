const express = require('express');
const mongodb = require('mongodb'); //mongodb driver
const mongoose = require('mongoose');
const User = require('../../../model/User');
const Token = require('../../../model/Token');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const URI = require('../../config/keys').URI;
const api_key = require('../../config/keys').api_key; 
// To send mails
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const ExtractJwt = require('passport-jwt').ExtractJwt;

const router = express.Router();


// Connexion

mongoose.connect( URI, { dbName: 'furniture-loan', useNewUrlParser: true, useUnifiedTopology: true }, ()=> console.log('connected to DB'));
mongoose.connection.on('connected', () => {
  console.log('Connexion is on');
});



// router.get('/profile', passport.authenticate('jwt', { session: false}),
//   (req, res) => {
//     console.log(req);
//     return res.json(req.user)
//   }
// );

router.get('/profile', function(req, res, next) {
  res.send("ALLO T AS PAS DE SCHAMPOING");
});

passport.serializeUser(function(user, done) {
  console.log("SERIALISER");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("DESERIA");
  console.log(id);
  User.findById(id).then((user))
  done(null, user);
});

//scope: ['profile', 'email']

router.get('/google',
      passport.authenticate('google', {scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
      ]  }));

  router.get('/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      console.log('REQ ET RES DU CALLBACK');
      console.log(res);
      // console.log(req);
      res.setHeader('Access-Control-Allow-Origin', '*');
      if (req.method === "OPTIONS") {
        res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-type');
      }
      const payload = {
        _id: req.session.passport.user,
      }
      jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) =>  {
        if (err) {
          res.redirect('/api/users/profile');
        } else {
          console.log(token);
          res.clearCookie('jwt');
          console.log('COOKIE PARSER');
          console.log(req.cookies);
          res.cookie('jwt', token);
          console.log(req.cookies);
        }
        res.header("Access-Control-Allow-Origin", "http://localhost:8080");
        res.redirect('/api/users/profile');
      });
  
    
  });

// router.post('/profile', verifyToken, (req, res) => {
//    jwt.verify(req.token, key, (err, authData) => {
//      console.log(req.token);
//      console.log(authData);
//     //  console.log(err);
//      if (err) {
//       return res.status(403).json({
//         err: 'Erroeffefe'
//       });
//      } else {
//        res.json({
//          message: 'Profile ok',
//          authData
//        });
//      }
//    });
//   });


router.get('/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/api/users/profile',
                                      failureRedirect: '/login' }));


//Sign up a user
router.post('/signup', function (req, res) {
  let {
    email,
    password,
    passwordConfirmed,
    loaner,
    renter

  } = req.body;
  if (password !== passwordConfirmed) {
    return res.status(404).json({
      err: 'Passwords dont match'
    });
  };
  User.findOne({ mail: email }).then(user => {
    if (user) {
      let msg0 = 'Cet email est deja utilisé.';
      let msg;
      if (user.renter && !user.loaner) {
        msg = msg0 + ' Si vous voulez vous inscrire en tant que prêteur, veuillez vous connecter et le déclarer dans Mon Compte';
      } else if (user.loaner && !user.renter) {
        msg = msg0 + ' Si vous voulez vous inscrire en tant qu emprunteur, veuillez vous connecter et le déclarer dans Mon Compte';
      } else {
        msg = msg0;
      }
        return res.status(404).json({
          err: msg
        });
    } else {

      let user = new User({ mail: email, pswd: password, loaner: loaner, renter: renter});
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.pswd, salt, (err, hash) => {
    
          if (err) throw err;
    
          user.pswd = hash;
          user.save().then(user => {
    
            let token = crypto.randomBytes(16).toString('hex');
            let new_token = new Token({ _userId: user._id, token: token });
    
            new_token.save(function (err) {
              if (err) {
                User.remove({ _id: user._id});
                return res.status(500).send({ msg: "Probleme à l'enregistrement" });
              }
              let host = req.get('host');
              // let api_key = process.env.SENDGRID_API_KEY;
              sgMail.setApiKey(api_key);
              let link = "http://" + host + "/api/auth/confirm?token=" + token;
              const msg = {
                to: user.mail,
                from: 'lendlecontact1@gmail.com',
                subject: 'Confirm your email address',
                html: 'Hello,<br><br><br>Please click on the link to <strong>verify your email</strong>.<br><br><br><a href=' + link + '>Click here to verify</a>',
              };
    
              sgMail.send(msg, function (err) {
                if (err) {
                  console.log('eeee');
                  User.remove({ _id: user._id});
                  return res.status(500).send({ 
                    msg: err.message 
                  }); 
                }
                return res.status(201).json({
                  success: true,
                  msg: "Vous êtes enregistré"
                });
            });
          });
              
          });
        });
        });
    }
  });
  });



  //if the user asks to receive a mail of validation again
  router.post('/validation', function (req, res) {
    let {
      email
    } = req.body;
    console.log(req.body);
    User.findOne({ mail: email }).then(user => {
      if (!user) {
        return res.status(404).json({
          err: 'Vous nêtes pas inscrit'
        });
      } else {
        let token = crypto.randomBytes(16).toString('hex');
        let new_token = new Token({ _userId: user._id, token: token });
        new_token.save(function (err) {
          if (err) {
            User.remove({ _id: user._id});
            return res.status(500).send({ msg: "Probleme à l'enregistrement" });
          }
          let host = req.get('host');
                // let api_key = process.env.SENDGRID_API_KEY;
          sgMail.setApiKey(api_key);
          let link = "http://" + host + "/api/auth/confirm?token=" + token;
          const msg = {
            to: email,
            from: 'lendlecontact1@gmail.com',
            subject: 'Confirm your email address',
            html: 'Hello,<br><br><br>Please click on the link to <strong>verify your email</strong>.<br><br><br><a href=' + link + '>Click here to verify</a>',
          };
      
        sgMail.send(msg, function (err) {
          if (err) {
            User.remove({ _id: user._id});
            return res.status(500).send({ 
              msg: err.message 
            }); 
          }
          return res.status(201).json({
            success: true,
            msg: "Un mail vous a été envoyé"
          });
        });
      });
    }  
    });
});
  

// when a user clicks on the validation link in his mailbox
  router.get('/confirm', function (req, res) {
    const token = req.query.token;
    Token.findOne({ token: token}).then(token => {
      if (!token) {
        return res.status(404).json({
          err: 'Votre token a peut être expiré'
        });
      }
      let user_id = token._userId;
      User.findOne({ _id: user_id}).then(user => {
        if (!user) {
          return res.status(404).json({
            err: 'Votre compte nest pas reconnu'
          });
        }
        else{
          if (user.isVerified) {

            res.redirect('http://localhost:8080/#/login');
          } else{
            user.isVerified = true;
            user.save(function(err) {
              if (err) {
                return res.status(404).json({
                  err: 'Probleme de validation. Veuillez réessayer'
                });
              }
            });
            res.redirect('http://localhost:8080/#/login');
            // res.send('<h4 style="text-align:center;margin-top:4vh;">Votre compte est validé</h4>');
            // return res.status(201).json({
            //   err: 'Votre compte est validé. Vous pouvez vous connecter'
            // });
          }
        }
        });
      });
    
  });

router.post('/login', function (req, res) {
  let mail = req.body.email;
  let pswd = req.body.password;
  console.log('PASD');
  console.log(pswd);
  User.findOne({ mail: mail }).then(usr => {
    console.log(usr);
    if (!usr) {
      return res.status(404).json({
        type: 0,
        err: 'Cet email nest pas associe a un compte'
      });
    } else {
      if (!usr.isVerified) {
        return res.status(404).json({
          type: 1,
          err: 'Votre mail n a pas été validé. Regardez votre boîte mail'
        });
      } else {
        console.log('BOTH');
        console.log(pswd);
        console.log(usr.pswd);
        console.log(usr);
        bcrypt.compare(pswd, usr.pswd).then(isMatch => {
          if (isMatch) {
            const payload = {
              _id: usr._id,
              mail: usr.mail
            }
            const { loaner, renter, language } = usr;
            const user = {loaner, renter, language};
            jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) =>  {
              // res.redirect('/api/users/profile');
              res.status(200).json({
                success: true,
                user: user,
                 token: `${token}`,
                msg: "Vous êtes connecté.e"
              })
            });
          } else {
            return res.status(404).json({
              type: 0,
              err: 'Le mot de passe est erroné'
            });
          }
        })
      }
    }
  });
});


module.exports = router;