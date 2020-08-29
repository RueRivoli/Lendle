const express = require('express');
const mongoose = require('mongoose');
const Furnit = require('../../../model/Furnit');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const fs = require('fs');
const ObjectId = mongoose.Types.ObjectId;
const URI = require('./../../config/keys').URI;
const router = express.Router();

mongoose.connect( URI, { dbName: 'furniture-loan', useNewUrlParser: true, useUnifiedTopology: true }, ()=> console.log('connected to DB'));

let gfs;

mongoose.connection.once('open', () => {
  // Init stream
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('connect to uploads');
})


router.post('/', function (req, res) {
    console.log('post Review');
    var review = new Review();
    review.rental_id =  ObjectId(req.body.rental_id);
    review.author_id =  ObjectId(req.body.author_id);
    review.text =  req.body.text;
    review.mark = req.body.mark;
    review.reason = req.body.reason;
    review.save(function (err) {
      if (err) {
        console.log('Error');
        return res.status(404).json({
            error: err,
            msg: 'An error occured'
          });
      } else {
        return res.status(201).json({
          review: review,
          msg: 'Bravo, votre avis a été enregistré'
        });
      }
    });
  });

router.get('/', function (req, res) {
  let db = mongoose.connection.db;
  console.log(req.query);
  let word = '';
  let city = '';
  let type = '';
  if (req.query.word) word = req.query.word;
  if (req.query.type) type = req.query.type;
  if (req.query.city) city = req.query.city;
  const regex_word = new RegExp(word);
  const regex_type = new RegExp(type);
  const regex_city = new RegExp(city);
  console.log('Les queries de la requete :');
  console.log(word);
  console.log(type);
  console.log(city);
  console.log('Les regex :');
  console.log(regex_word);
  console.log(regex_type);
  console.log(regex_city);

  db.collection("furnits").aggregate([
    { "$match": { 
      $and: [
      { type: {$regex: regex_type}},
      { city: {$regex: regex_city}},
      { $or: [ {name: { $regex: regex_word }}, { type: { $regex: regex_word } }, { description: { $regex: regex_word } }]}
      ]}}
  ]).toArray(function(err, furnits) {
      console.log(furnits);
    if(err){
      return res.status(404).json({
          err: 'Erreur de recherche de meubles'
      });
    } else if(!furnits || furnits.length === 0){
      return res.json({furnits: {}, imgUrl: {}});
    } else {
      return retrievePictures(furnits, req, res);
        }
    });
});






module.exports = router;