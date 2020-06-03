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

router.get('/profile', function(req, res) {
  return res.status(201).json({
    profile: req.user
  });
});



// Update data of the user
router.post('/update', function (req, res) {
  console.log('router.post(/update');
  let { firstname, lastname, language, renter, loaner, address, postcode, city, description
  } = req.body;
  let id = req.user._id;
  User.updateOne( {_id: id }, { firstname,
    lastname,
    language,
    renter,
    loaner,
    address,
    postcode,
    city,
    description}, function (err) {
    if (err) {
      return res.status(404).json({
        err: 'Erreur d edition'
      });
    } else {
      return res.status(201).json({
        msg: 'Mise à jour effectuée'
      });
    }
  })
});

// Update data of the user
router.post('/password', function (req, res) {
  console.log('router.post(/password');
  let { actualpswd, pswd, pswdCf
  } = req.body;
  let id = req.user._id;
  if (pswd !== pswdCf) {
    return res.status(404).json({
      err: 'Les mots de passe ne correspondent pas'
    });
  };
  User.findOne({ _id: id }).then(user => {
    console.log(user);
    if (!user) {
      return res.status(404).json({
        err: 'Une erreur sest produite'
      });
    } else {
      if (!user.isVerified) {
        return res.status(404).json({
          err: 'Votre mail n a pas été validé. Regardez votre boîte mail'
        });
      } else {
        console.log('BOTH');
        console.log(pswd);
        console.log(user.pswd);
        bcrypt.compare(actualpswd, user.pswd).then(isMatch => {
          console.log(isMatch);
          if (!isMatch) {
            return res.status(404).json({
              err: 'Le mot de passe actuel n est pas correct'
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(pswd, salt, (err, hash) => {
                if (err) throw err;
                User.updateOne( {_id: id }, { pswd: hash }, function (err) {
                  if (err) {
                    return res.status(404).json({
                      err: 'Erreur de modification de mot de passe'
                    });
                  } else {
                    return res.status(201).json({
                      msg: 'Le mot de passe a été modifié'
                    });
                  }
                });
              });
            });
          }
        });
      }
    }
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

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  console.log(req.headers);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    console.log(bearerToken);
    req.token = bearerToken;
    next();
  }
  else {
    return res.status(403).json({
      err: 'Don t find token'
    });
  }
}

// Add User

router.post('/', function (req, res) {
  console.log(req);
  var user = new User();
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.mail = req.body.mail;
  user.pswd = req.body.pswd;
  user.address = req.body.address;
  user.city = req.body.city;
  user.usurer = req.body.usurer;
  user.borrower = req.body.borrower;
  user.description = req.body.description;
  user.subscription = new Date();
  console.log(user);
  user.save(function (err) {
    if (err) {
      console.log('EORROR');
      res.send(err);
    }
    res.send('Bravo, vous avez été ajouté');
  });
});


router.post('/register', function (req, res) {
  console.log(req.body);
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
        err: 'This email is already used'
      });
    }
  });
  
  let user = new User();
  user.mail = email;
  user.pswd = password;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.pswd, salt, (err, hash) => {
      if (err) throw err;
      console.log(hash);
      user.pswd = hash;
      user.save().then(user => {
        return res.status(201).json({
          success: true,
          msg: "User is now registered"
        });
      })
    })
  });
});


router.post('/login', function (req, res) {
  let mail = req.body.email;
  let pswd = req.body.password;
  User.findOne({ mail: mail }).then(user => {
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



router.delete('/:user_id', function (req, res) {
  Post.deleteOne( { _id: req.params.user_id } , function (err) {
    if (err) {
      res.send(err);
    }
    res.send('Bravo, cet utilisateur a été supprimé');
  });
});


module.exports = router;