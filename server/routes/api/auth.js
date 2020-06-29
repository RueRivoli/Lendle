const express = require('express');
const mongodb = require('mongodb'); //mongodb driver
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
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

passport.serializeUser(function(user, done) {
  console.log("SERIALISER");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("DESERIALISER");
  console.log(id);
  User.findById(id).then((user))
  done(null, user);
});

router.get('/login',
  function(req, res){
    res.send('login');
  });


router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {

      const payload = {
        _id: req.session.passport.user,
        loaner: req.user.loaner,
        renter: req.user.renter
      }
      console.log('payload before redirection');
      console.log(payload);
      jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) =>  {
        if (err) {
          res.redirect('http://localhost:8080/login');
        } else {
          res.redirect('http://localhost:8080/profile?token=' + `${token}`);
          // console.log(token);
          // res.clearCookie('jwt');
          // console.log('COOKIE PARSER');
          // console.log(req.cookies);
          // res.cookie('jwt', token);
          // console.log(req.cookies);
        }
      });
  });


router.get('/facebook',
  passport.authenticate('facebook', ["email", "publish_stream", "user_location", "user_hometown", "user_birthday", "read_friendlists"]));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    const payload = {
      _id: req.session.passport.user,
      loaner: req.user.loaner,
      renter: req.user.renter
    }
    jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) =>  {
      res.redirect('http://localhost:8080/profile?token=' + `${token}`);
    });
    
  });



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
      err: 'Les mots de passe ne correspondent pas'
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

  //if the user forgot its password
  router.post('/passwordForgotten', function (req, res) {
    let {
      email
    } = req.body;
    User.findOne({ mail: email }).then(user => {
      if (!user) {
        return res.status(404).json({
          err: 'Cet email ne correspond pas à un utilisateur inscrit'
        });
      } else {
        let token = crypto.randomBytes(16).toString('hex');
        let new_token = { _userId: user._id, token: token, tokenExpires: Date.now() + 3600000 };
        Token.updateOne( {_userId: user._id }, new_token, { upsert: true }, function (err) {
          if (err) {
            return res.status(404).json({
              err: 'Erreur dans la procédure de modification de votre mot de passe. Veuillez réessayer.'
            });
          } else {
            //Envoi du mail de réinitialisation du mot de passe
            let host = req.get('host');
            sgMail.setApiKey(api_key);
            let link = "http://" + host + "/api/auth/resetPassword?token=" + token+ '&' + 'email=' + email;
            const msg = {
              to: email,
              from: 'lendlecontact1@gmail.com',
              subject: 'Reinitialiser votre mot de passe',
              html: 'Bonjour,<br><br><br>Vous avez déclaré avoir oublié votre mot de passe. Vous pouvez le réinitialiser:<br><br><br><a href=' + link + '>Cliquez ici pour continuer votre démarche</a>',
            };
            sgMail.send(msg, function (err) {
              if (err) {
                return res.status(404).send({ 
                  msg: 'Veuillez réessayer la réinitialisation de votre mot de passe, une erreur est survenue'
                }); 
              } else {
                return res.status(201).json({
                  success: true,
                  msg: "Un mail vous a été envoyé. Regardez vos mails"
                });
              }
            });
          }
        });
    }
    });
});


  //if the user forgot its password
  router.get('/resetPassword', function (req, res) {
    console.log('resetPassword');
    let {
      token,
      email
    } = req.query;
    Token.findOne({ token: token, tokenExpires: { $gt: Date.now() } }).then(tkn => {
      if (!tkn) {
        res.render("about", { title: "Erreur", message: "Erreur dans la modification du mot de passe. Le token est peut-être expiré. Réessayer sur le site!" });
      } else {
          User.findOne({ _id: tkn._userId, mail:email }).then(user => {
            console.log(user);
            if (!user) {
              res.render("about", { title: "Erreur", message: "Erreur dans la réinitialisation de votre mot de passe. Veuillez réessayer sur le site!" });
            } else {
                res.redirect('http://localhost:8080/reinitializepassword?email=' + email + '&token=' + `${tkn.token}`);
            }
          });
    }
  });
});

router.post('/reinitializePassword', function (req, res) {
  console.log('reinitializePassword');
  let {
    password,
    token,
    email
  } = req.body;

  Token.findOne({ token: token, tokenExpires: { $gt: Date.now() } }).then(tkn => {
    if (!tkn) {
      return res.status(201).json({
        err: 'Erreur dans la réinitialisation de votre mot de passe. Veuillez réessayer sur le site'
      });
    } else {
      let userId = tkn._userId;
      User.findOne({ _id: userId, mail: email }).then(usr => {
          console.log(usr);
          if (!usr) {
            return res.status(404).json({
              err: 'Erreur dans la réinitialisation de votre mot de passe. Veuillez réessayer sur le site'
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                usr.pswd = hash;
                usr.isVerified = true;
                usr.save(function(err) {
                  if (err) {
                    return res.status(404).json({
                      err: 'Probleme de validation. Veuillez réessayer'
                    });
                  } else {
                    const payload = {
                      _id: usr._id,
                      mail: usr.mail
                    }
                    const { loaner, renter, language } = usr;
                    const user = {loaner, renter, language };
                    jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) =>  {
                      res.status(200).json({
                        success: true,
                        user: user,
                        id: usr._id,
                        token: `${token}`,
                        msg: "Votre mot de passe est modifié, vous êtes connecté.e"
                      })
                    });
                }
                });
              });
            });
          }
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
          }
        }
        });
      });
    
  });

router.post('/login', function (req, res) {
  let mail = req.body.email;
  let pswd = req.body.password;
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
        bcrypt.compare(pswd, usr.pswd).then(isMatch => {
          if (isMatch) {
            const payload = {
              _id: usr._id,
              mail: usr.mail
            }
            const { loaner, renter, language } = usr;
            const user = {loaner, renter, language };
            jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) =>  {
              res.status(200).json({
                success: true,
                user: user,
                id: usr._id,
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