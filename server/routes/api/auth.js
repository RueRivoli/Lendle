const express = require('express');
const mongodb = require('mongodb'); //mongodb driver
const mongoose = require('mongoose');
const User = require('../../../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const URI = require('../../config/keys').URI;

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
    }
  });
  
  let user = new User();
  user.mail = email;
  user.pswd = password;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.pswd, salt, (err, hash) => {
      if (err) throw err;
      user.pswd = hash;
      user.save().then(user => {
        return res.status(201).json({
          success: true,
          msg: "Vous êtes enregistré"
        });
      })
    })
  });
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