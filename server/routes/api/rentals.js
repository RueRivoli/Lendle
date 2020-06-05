const express = require('express');
const mongoose = require('mongoose');
const Rental = require('../../../model/Rental');
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();

// called for RentalComponent
// retrieve the rental that is rental_id and retrieve furnit and owner data
// This part is for the loaner
router.get('/details/loan/:rental_id', function (req, res) {
  let db = mongoose.connection.db;
  let id = req.user._id.toString();
  let rental_id = ObjectId(req.params.rental_id);

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

// called for RentalComponent
// retrieve the rental that is rental_id and retrieve furnit and loaner data
// This part is for the renter
router.get('/details/rent/:rental_id', function (req, res) {
  let db = mongoose.connection.db;
  let id = req.user._id.toString();
  let rental_id = ObjectId(req.params.rental_id);

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
          "localField": "loaner_id", 
          "foreignField": "_id",
          "as": "loaner"
      }
  }
  ]).next(function(err, rental) {
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

// called for MyRentalsComponent
// retrieve all the rentals attached to a specified user
router.get('/loan', function (req, res) {
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

router.get('/rent', function (req, res) {
  let db = mongoose.connection.db;
  let id = req.user._id.toString();
  console.log(id);
  db.collection("rentals").aggregate([
    { "$match": { "renter_id": ObjectId(id) } },
    { 
        "$lookup": { 
            "from": 'furnits', 
            "localField": 'furnit_id', 
            "foreignField": '_id', 
            "as": 'furnit' 
        }
    }]).toArray(function(err, rentals) {
    if(err){
      return res.status(404).json({
          err: 'Erreur d editions'
      });
    } else if(!rentals || rentals.length === 0){
      return res.status(201).json({
        rentals: {}
      });
    } else {
      console.log(rentals);
        return res.status(201).json({
            rentals
          });
        }
    });
});


module.exports = router;