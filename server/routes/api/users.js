const express = require('express');
const mongodb = require('mongodb'); //mongodb driver
const mongoose = require('mongoose');
const User = require('../../../model/User');


const router = express.Router();


// Connexion
const URI = 'mongodb+srv://Alex3:Alex3@cluster0-pbmzu.mongodb.net/furniture-loan?retryWrites=true&w=majority';

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


// Add Post

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

// Delete Post

router.delete('/:user_id', function (req, res) {
  Post.deleteOne( { _id: req.params.user_id } , function (err) {
    if (err) {
      res.send(err);
    }
    res.send('Bravo, cet utilisateur a été supprimé');
  });
});


module.exports = router;