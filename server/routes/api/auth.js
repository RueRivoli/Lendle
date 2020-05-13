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
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const router = express.Router();


// Connexion

mongoose.connect( URI, { dbName: 'furniture-loan', useNewUrlParser: true, useUnifiedTopology: true }, ()=> console.log('connected to DB'));
mongoose.connection.on('connected', () => {
  console.log('Connexion is on');
});


router.get('/', function (req, res) {
  User.find(function (err, usrs) {
    if (err) {
      console.log('err');
      res.send(err);
    }
    res.json(usrs);
  });
});

// router.get('/profile', passport.authenticate('jwt', { session: false}),
//   (req, res) => {
//     console.log(req);
//     return res.json(req.user)
//   }
// );

router.get('/profile', function(req, res, next) {
  res.send(req.user);
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

// function sendMail(mail, host, hash, function (res, err) => {
//   let api_key = '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';
//   // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//   let link="http://"+host+"/verify?id=" + hash;
//   console.log(link);
//   sgMail.setApiKey(api_key);
//   const msg = {
//     to: mail,
//     from: 'flgallois@gmail.com',
//     subject: 'Confirm your email address',
//     html: 'Hello,<br><br><br><br>Please Click on the link to <strong>verify your email</strong>.<br><br><br><a href='+link+'>Click here to verify</a>',
//   };
//   sgMail.send(msg, function(err, json){
//     if(err) { 
//       console.error(err.response.body);
//       console.log('echec');
//       return res.status(500).send({ msg: err.message });
//     }
//     return res.status(200).send('A verification email has been sent to ' + mail + '.');
//   });
// });


router.post('/register', function (req, res) {
  let {
    email,
    password,
    passwordConfirmed
  } = req.body;
  if (password !== passwordConfirmed) {
    return res.status(404).json({
      err: 'Passwords dont match'
    });
  };
  User.findOne({ mail: email }).then(user => {
    if (user) {
      return res.status(404).json({
        err: 'Cet email est deja utilisé'
      });
    } else {
      let user = new User({ mail: email, pswd: password});
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
              let link = "http://" + host + "/verify?id=" + token;
              const msg = {
                to: user.mail,
                from: 'lendlecontact1@gmail.com',
                subject: 'Confirm your email address',
                html: 'Hello,<br><br><br><br>Please click on the link to <strong>verify your email</strong>.<br><br><br><a href=' + link + '>Click here to verify</a>',
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


  router.post('/confirm', function (req, res) {
    
  });

router.post('/login', function (req, res) {
  console.log('LLOFIN');
  let mail = req.body.email;
  let pswd = req.body.password;
  console.log(mail);
  console.log(pswd);
  User.findOne({ mail: mail }).then(user => {
    console.log(user);
    if (!user) {
      return res.status(404).json({
        err: 'Cet email nest pas associe a un compte'
      });
    } else {
      bcrypt.compare(pswd, user.pswd).then(isMatch => {
        if (isMatch) {
          const payload = {
            _id: user._id,
            mail: user.mail
          }
          jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) =>  {
            res.status(200).json({
              success: true,
              token: `Bearer ${token}`,
              msg: "Vous êtes connecté.e"
            })
          });
        } else {
          return res.status(404).json({
            err: 'Le mot de passe est erroné'
          });
        }
      })
    }
  });
});


module.exports = router;