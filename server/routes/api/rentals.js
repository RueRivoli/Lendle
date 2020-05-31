const express = require('express');
const mongodb = require('mongodb'); //mongodb driver
const mongoose = require('mongoose');
const Rental = require('../../../model/Rental');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const ObjectId = mongoose.Types.ObjectId;
const URI = require('./../../config/keys').URI;

const router = express.Router();


// Connexion

mongoose.connect( URI, { dbName: 'furniture-loan', useNewUrlParser: true, useUnifiedTopology: true }, ()=> console.log('connected to DB'));


let gfs;

mongoose.connection.once('open', () => {
  // Init stream
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('connect to uploads');
})

// Create storage engine

const storage = new GridFsStorage({
  // db: mongoose.connection,
  url: URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});



// called for myRentalsComponent
// return all rentals and their associated furnits
router.get('/details/:rental_id', function (req, res) {
  let db = mongoose.connection.db;
  let id = req.user._id.toString();
  console.log(req.params);
  let rental_id = ObjectId(req.params.rental_id);
  console.log(rental_id);

  db.collection("rentals").aggregate([
    { "$match": { "_id": ObjectId(rental_id) } },
    { 
        "$lookup": { 
            "from": 'furnits', 
            "localField": 'furnit_id', 
            "foreignField": '_id', 
            "as": 'furnit' 
        } 
    },
    {
      "$lookup":{
          "from": "users", 
          "localField": "renter_id", 
          "foreignField": "_id",
          "as": "owner"
      }
  }
  ]).next(function(err, rental) {
      console.log('rental');
      console.log(rental);
    if(err){
      return res.status(404).json({
          err: 'Erreur d editions'
      });
    } else if(!rental || rental.length === 0){
      return res.status(404).json({
        err: 'Pas de resultat'
      });
    } else {
        return res.status(201).json({
            rental
          });
        }
    });
});

//appeler pour searchComponent
router.get('/', function (req, res) {
  let db = mongoose.connection.db;
  let id = req.user._id.toString();
  
  db.collection("rentals").aggregate([
    { "$match": { "loaner_id": ObjectId(id) } },
    { 
        "$lookup": { 
            "from": 'furnits', 
            "localField": 'furnit_id', 
            "foreignField": '_id', 
            "as": 'furnit' 
        } 
    }]).toArray(function(err, rentals) {
      console.log(rentals);
    if(err){
      return res.status(404).json({
          err: 'Erreur d editions'
      });
    } else if(!rentals || rentals.length === 0){
      return res.status(404).json({
        err: 'Pas de resultat'
      });
    } else {
        return res.status(201).json({
            rentals
          });
        }
    });
});


module.exports = router;