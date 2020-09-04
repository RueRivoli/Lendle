const express = require('express');
const mongoose = require('mongoose');
const Rental = require('../../../model/Rental');
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();




// called for RentalComponent
// retrieve the rental that is rental_id and retrieve furnit and owner data
// This part is for the loaner
router.get('/details/', function (req, res) {
  let db = mongoose.connection.db;
  console.log("details");
  console.log(req.query);
  
  let furnit_id = ObjectId(req.query.furnit_id);
  let cond, and = [{}], lookup2, match = {};
  match["furnit_id"] = { $eq: furnit_id };
  lookup2 = {
        "from": "users", 
        "localField": "loaner_id", 
        "foreignField": "_id",
        "as": "loaner"
  };
  if (req.query.loaner === 'true') {
    match["loaner_id"] = { $eq: ObjectId(req.user._id) };
    lookup2 = {
          "from": "users", 
          "localField": "renter_id", 
          "foreignField": "_id",
          "as": "renter"
  }
  }
  let today10daysago = new Date();
  today10daysago.setDate(today10daysago.getDate() - 10);
  if (req.query.isLocation === '1') cond = { $gte: [2]};
  else {
    cond = {$lt: 2},
    and = [ { "status": {$eq: 2} }, { "confirmation": {$gt: today10daysago} } ] 
  }
  console.log(match);
  console.log(cond);
  console.log(and);
  db.collection("rentals").aggregate([
    { "$match": {
      "$and": [ match,
        {
        "$or": [
          { "status": cond },
          { "$and": and }
          ]
        }
      ]
    }
  },
    { 
        "$lookup": { 
            "from": 'furnits',
            "localField": 'furnit_id', 
            "foreignField": '_id', 
            "as": 'furnit' 
        } 
    },
    {
      "$lookup": lookup2
  }
  ]).toArray(function(err, rentals) {
    console.log('res');
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


// router.get('/toFurnit/:furnit_id', function (req, res) {
//   let db = mongoose.connection.db;
//   db.collection("rentals").aggregate([
//     { "$match": { "furnit_id":  ObjectId(req.params.furnit_id) } },
//     { 
//         "$lookup": { 
//             "from": 'furnits', 
//             "localField": 'furnit_id', 
//             "foreignField": '_id', 
//             "as": 'furnit' 
//         } 
//     },
//     {
//       "$lookup":{
//           "from": "users", 
//           "localField": "loaner_id", 
//           "foreignField": "_id",
//           "as": "loaner"
//       }
//   }
//   ]).toArray(function(err, rentals)  {
//     console.log('BIG RENTALS');
//     console.log(rentals);
//     if(err){
//       return res.status(404).json({
//           err: 'Erreur d editions'
//       });
//     } else if(!rentals || rentals.length === 0){
//       return res.status(404).json({
//         err: 'Pas de resultat'
//       });
//     } else {
//         return res.status(201).json({
//             rentals
//           });
//         }
//     });
// });

router.post('/', function (req, res) {
  console.log('post Rental');
  var rental = new Rental();
  rental._id =  req.body._id;
  rental.furnit_id =  ObjectId(req.body.furnit_id);
  rental.loaner_id =  ObjectId(req.body.loaner_id);
  rental.renter_id =  ObjectId(req.body.renter_id);
  rental.loan_start = new Date(req.body.loan_start);
  rental.loan_end = new Date(req.body.loan_end);
  rental.status = 0;
  rental.price = req.body.price;
  rental.save(function (err) {
    if (err) {
      console.log('Error');
      res.send(err);
    } else {
      return res.status(201).json({
        rental: rental,
        msg: 'Bravo, votre location a été proposée'
      });
    }
  });
});


// "$or": 
// [{ "$and": [ 
//     {"loan_start": ["$lt", start ] }, 
//     { "loan_end": ["$gt", start] }
//   ]
// }, 
// { "$and": [ 
//   {"loan_start": ["$lt", end] }, 
//   { "loan_end": ["$gt", end ] } ]
// }]
// }

router.get('/isUnique', function (req, res) {
  let db = mongoose.connection.db;
  console.log('isUnique');
  console.log(req.query.furnit_id);
  console.log(req.query.loaner_id);
  db.collection("rentals").aggregate([
    { "$match": { "$and": [
       { "furnit_id": { $eq: ObjectId(req.query.furnit_id) } },
       { "loaner_id": { $eq: ObjectId(req.query.loaner_id) } },
        { "status": { $lt: 2 } },
        { "status": { $gt: -1 } },
      ] 
    }
  },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
    }
  }
  ]).toArray(function(err, rentals)  {
    console.log("Results");
    console.log(rentals);
    if(err){
        return res.status(404).json({
          err: 'Erreur de recherche de meubles'
      });
    } else if(!rentals || rentals.length === 0){
        return res.status(201).json({
          count: 0,
          msg: 'Vous n avez pas d autres demandes avec ce meuble la'
        });
    } else {
        return res.status(201).json({
          count: rentals[0].count,
          msg: 'Attention vous avez déjà proposé une location pour ce meuble la'
        });
        }
    });
});

router.get('/isRentable/:furnit_id', function (req, res) {
  let db = mongoose.connection.db;
  console.log('isRentable');
  console.log(req.params.furnit_id);
  console.log(req.query);
  let start = new Date(req.query.loanStart);
  let end = new Date(req.query.loanEnd);
  db.collection("rentals").aggregate([
    { "$match": { "$and": [
       { "furnit_id": { $eq: ObjectId(req.params.furnit_id) } },
        { "status": { $gt: 0 } },
        {"loan_start": {"$lt": end } }, 
        { "loan_end": {"$gt": start} }
      ] 
    }
  },
    { "$group":
      {
        _id: "$furnit_id",
        maxStatus: { "$max": "$status"},
      }
  }
  ]).toArray(function(err, rentals)  {
    console.log("Results");
    console.log(rentals);
    if(err){
        return res.status(404).json({
          err: 'Erreur de recherche de meubles'
      });
    } else if(!rentals || rentals.length === 0){
        return res.status(201).json({
          maxStatus: 0,
          msg: 'Vous pouvez accepter cette location'
        });
    } else {
        return res.status(201).json({
          maxStatus: rentals[0].maxStatus,
          msg: 'Attention vous avez déjà accepté une location pendant ces dates'
        });
        }
    });
});


router.post('/update', function (req, res) {
  console.log('Update a rental');
  let db = mongoose.connection.db;
  let rental_id = ObjectId(req.body._id);
  let status = req.body.status;
  let statusCheck = req.body.statusCheck;
  let match = {"_id": rental_id };
  if (statusCheck) match.status = statusCheck
  let set = {};
  if (req.body.loan_start) set.loan_start = new Date(req.body.loan_start);
  if (req.body.loan_end) set.loan_end = new Date(req.body.loan_end);
  if (req.body.review_loaner) set.review_loaner = ObjectId(req.body.review_loaner);
  if (req.body.review_renter) set.review_renter = ObjectId(req.body.review_renter);
  if (status) set.status = status;
  console.log('MATCH');
  console.log(match);
  console.log('SET');
  console.log(set);
  db.collection("rentals").findOneAndUpdate(
    match,
    { "$set": set },
      function(err, result) {
        console.log('Result');
        console.log(result.value);
        if (err) {
          console.log('Error');
          return res.status(404).json({
            error: err,
            msg: 'Une erreur est survenue'
          });
        }
        else {
          return res.status(201).json({
            success: true,
            msg: 'Bravo, votre location a été mise à jour'
          });
      }
    }
);

//   db.collection("rentals").updateOne(
//     { "_id" : ObjectId(req.body._id) },
//     { $set: { "loan_start" : new Date(req.body.loan_start), "loan_end": new Date(req.body.loan_end) } }
//  , (err) => {
//     if (err) {
//       console.log('Error');
//       res.send(err);
//     }
//     else {
//       return res.status(201).json({
//         // rental: rt,
//         msg: 'Bravo, votre location a été mise à jour'
//       });
//     }
//   });
});

// called for RentalComponent
// retrieve the rental that is rental_id and retrieve rental and loaner data
// This part is for the renter

// router.get('/details/rent/:rental_id', function (req, res) {
//   let db = mongoose.connection.db;
//   let id = req.user._id.toString();
//   let rental_id = ObjectId(req.params.rental_id);
//   console.log('DETAILS rebt TENTAL ID')
//   db.collection("rentals").aggregate([
//     { "$match": { "_id": ObjectId(rental_id) } },
//     { 
//         "$lookup": { 
//             "from": 'furnits', 
//             "localField": 'furnit_id', 
//             "foreignField": '_id', 
//             "as": 'furnit' 
//         } 
//     },
//     {
//       "$lookup":{
//           "from": "users", 
//           "localField": "loaner_id", 
//           "foreignField": "_id",
//           "as": "loaner"
//       }
//   }
//   ]).next(function(err, rental) {
//     if(err){
//       return res.status(404).json({
//           err: 'Erreur d editions'
//       });
//     } else if(!rental || rental.length === 0){
//       return res.status(404).json({
//         err: 'Pas de resultat'
//       });
//     } else {
//         return res.status(201).json({
//             rental
//           });
//         }
//     });
// });

// called for MyRentalsComponent
// retrieve all the rentals attached to a specified user
router.get('/loan', function (req, res) {
  let db = mongoose.connection.db;
  let id = req.user._id;
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
    } else if(!rentals){
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

router.get('/:rental_id', function (req, res) {
  console.log('TEST');
  let db = mongoose.connection.db;
  // let id = req.user._id;
  console.log(req.params.rental_id);
  let rental_id = ObjectId(req.params.rental_id);
  console.log('get/:rental_id');
  console.log(rental_id);
  // let today10daysago = new Date();
  // today10daysago.setDate(today10daysago.getDate() - 10);
  // if (req.params.isLoaner === 'true') match = { "loaner_id": ObjectId(id) }
  // else match = { "renter_id": ObjectId(id) }
  db.collection("rentals").aggregate([
    { "$match": { "_id": rental_id, "status": { $ne: -2}} },
    { 
      "$lookup": { 
          "from": 'furnits', 
          "localField": 'furnit_id',
          "foreignField": '_id', 
          "as": 'furnit' 
      }
    },
    { 
      "$lookup": { 
          "from": 'users', 
          "localField": 'renter_id',
          "foreignField": '_id', 
          "as": 'owner' 
      }
    },
  ]).next(function(err, rental) {
    console.log('get Rental by rental_id');
    console.log(rental);
    if(err){
      return res.status(404).json({
          err: 'Erreur de recherche'
      });
    } else if(!rental || rental.length === 0){
      return res.status(201).json({
        rental
      });
    } else {
        return res.status(201).json({
            rental
          });
        }
    });
});

// For page Locations
router.get('/statistics/:isLoaner', function (req, res) {
  let db = mongoose.connection.db;
  let id = req.user._id;
  let match;
  let today10daysago = new Date();
  today10daysago.setDate(today10daysago.getDate() - 10);
  if (req.params.isLoaner === 'true') match = { "loaner_id": ObjectId(id), "status": {$ne: -2} }
  else match = { "renter_id": ObjectId(id), "status": {$ne: -1} }
  db.collection("rentals").aggregate([
    { "$match": match },
      { "$project":
        { "demand": { $cond: {
          if: { $eq: ["$status", 0] }, then: 1, else: 0 
        } },
        "demandAccepted": { $cond: {
          if: { $eq: ["$status", 1] }, then: 1, else: 0 
        } },
        "loanConfirmed": { $cond: {
          if: { $eq: ["$status", 2] }, then: 1, else: 0 
        } },
        "loanFinished": { $cond: {
          if: { $eq: ["$status", 3] }, then: 1, else: 0 
        } },
        "loanRefusedByLoaner": { $cond: {
          if: { $eq: ["$status", -2] }, then: 1, else: 0 
        } },
        "loanRefusedByRenter": { $cond: {
          if: { $eq: ["$status", -1] }, then: 1, else: 0 
        } },
        "loanConfirmedRecently": { $cond: {
          if: { $and: [ { $eq: ["$status", 2] }, {$gt: ["$confirmation", today10daysago]} ]}, then: 1, else: 0 
        } },
        "furnit_id": 1,
        "confirmation": 1,
        "_id": 1
      },
   },
    {
      "$group" : { 
        "_id": "$furnit_id",
        "rental_id": { $first:"$_id" },
        "totalDemands": { $sum: "$demand"},
        "totalDemandsAccepted": { $sum: "$demandAccepted"},
        "totalLoansConfirmed": { $sum: "$loanConfirmed"},
        "totalLoansFinished": { $sum: "$loanFinished"},
        "totalLoansRefusedByLoaner": { $sum: "$loanRefusedByLoaner"},
        "totalLoansRefusedByRenter": { $sum: "$loanRefusedByRenter"},
        "totalLoansConfirmedRecently": { $sum: "$loanConfirmedRecently"},
        "lastConfirmation": {$max: "$confirmation"}
    } },
    { "$sort" : { "lastConfirmation": 1 } },
    { 
      "$lookup": { 
          "from": 'furnits', 
          "localField": '_id', 
          "foreignField": '_id', 
          "as": 'furnit' 
      }
    }
  ]).toArray(function(err, rentals) {
    console.log('STATISTICS');
    console.log(rentals);
    if(err){
      return res.status(404).json({
          err: 'Erreur d editions'
      });
    } else if(!rentals || rentals.length === 0){
      return res.status(201).json({
        rentals: []
      });
    } else {
        return res.status(201).json({
            rentals
          });
        }
    });
});


// router.get('/rent', function (req, res) {
//   let db = mongoose.connection.db;
//   let id = req.user._id.toString();
//   console.log(id);
//   db.collection("rentals").aggregate([
//     { "$match": { "renter_id": ObjectId(id) } },
//     { 
//         "$lookup": { 
//             "from": 'furnits', 
//             "localField": 'furnit_id', 
//             "foreignField": '_id', 
//             "as": 'furnit' 
//         }
//     }]).toArray(function(err, rentals) {
//     if(err){
//       return res.status(404).json({
//           err: 'Erreur d editions'
//       });
//     } else if(!rentals || rentals.length === 0){
//       return res.status(201).json({
//         rentals: {}
//       });
//     } else {
//       console.log(rentals);
//         return res.status(201).json({
//             rentals
//           });
//         }
//     });
// });

router.delete('/:rental_id', function (req, res) {
  let id = ObjectId(req.params.rental_id);
  Rental.deleteOne( { _id: id } , function (err) {
    if (err) {
      return res.status(404).json({
        error: err
      });
    } 
    else {
      return res.status(201).json({
        success: true
      });
    }

  });
});

module.exports = router;