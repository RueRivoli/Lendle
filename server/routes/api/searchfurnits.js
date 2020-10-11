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

/* To store in folder dest if no use of GridFS*/
const upload1 = multer({ dest: './uploads' })

const upload = multer({ storage });

// original to put again
// Retrieve only one picture for every furnit in a list of furnits
function retrievePictures(furnits, req, res) {
  let db = mongoose.connection.db;
  let collectionChunks = db.collection('uploads.chunks');
  // let picture_ids = [];
  let finalFile = {};
  // furnits.forEach(function(furn){
  //   if (furn.picture_ids.length > 0) picture_ids.push(furn.picture_ids[0]);
  //   else picture_ids.push(-1);
  // });

  let pic_len = Object.keys(furnits).length;
  furnits.forEach(function(ft, index) {
    ft.order = index;
    if (ft.picture_ids && ft.picture_ids[0]) {
      console.log('entree');
      let id = ObjectId(ft.picture_ids[0]);
      console.log(id);
      gfs.files.findOne({ _id: id }, (err, fl) => {
        console.log('Fichier trouvé => ')
        // console.log(fl);
        if (!fl || fl.length === 0) {
          finalFile[index] = null;
        } else {
          //if we find the file
          let contentType = fl.contentType;
          //we look for the chunks of the file
          collectionChunks.find({files_id: id}).sort({ n: 1}).toArray(function(err, chunks) {
          if(err){
            finalFile[index] = null;
          }
          else {
            if(!chunks || chunks.length === 0){
              finalFile[index] = null;
            } else {
              let fileData = [];
              for (let i = 0; i < chunks.length; i++) {
                fileData.push(chunks[i].data.toString('base64'));
              }
              finalFile[index] = 'data:' + contentType + ';base64,' + fileData.join('');
              if (Object.keys(finalFile).length === pic_len) {
                res.json({furnits: furnits, imgUrl: finalFile}); 
              }
            }
          }
      });
  }
});
} else {
  finalFile[index] = null;
  if (Object.keys(finalFile).length === pic_len) {
    res.json({furnits: furnits, imgUrl: finalFile}); }
}
});
}



router.get('/', function (req, res) {
  let db = mongoose.connection.db;

  let { word, type, city, order } = req.query;

  const regex_word = new RegExp(word);
  const regex_type = new RegExp(type);
  const regex_city = new RegExp(city);
  console.log('Les queries de la requête :');
  console.log(word + ' / ' + type + ' / ' + city + ' / ' + order);
  console.log('Les regex :');
  console.log(regex_word +  ' / ' + regex_type + ' / ' + regex_city );
  let sort = {};
  if (order && order !== 0) {
    sort = { price: parseInt(order) };
  }
  console.log(sort);
  // db.collection("furnits").aggregate([
  //   { "$match": {
  //       $and: [
  //       { type: {$regex: regex_type}},
  //       { city: {$regex: regex_city}},
  //       { $or: [ {name: { $regex: regex_word }}, { type: { $regex: regex_word } }, { description: { $regex: regex_word } }]}
  //       ]
  //     },
  //   },
  //   {
  //     "$sort": { price: "null"}
  //   }
  // ]).
    db.collection("furnits").find({
        $and: [
        { type: {$regex: regex_type}},
        { city: {$regex: regex_city}},
        { $or: [ {name: { $regex: regex_word }}, { type: { $regex: regex_word } }, { description: { $regex: regex_word } }]}
        ]
      }).sort(sort).toArray(function(err, furnits) {
      // console.log(furnits);
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









function retrieveImgUrlFromPictureIds(picture_ids, req, res) {
  let db = mongoose.connection.db;
  let collectionChunks = db.collection('uploads.chunks');
  let furnits = db.collection('furnits');
  var finalFile = {};
  picture_ids.forEach(function(pic, index){
    gfs.files.findOne({ _id: ObjectId(pic) }, (err, fl) => {
      if (err) {
        finalFile[index] = null;
        if (Object.keys(finalFile).length === pic_ids.length) {
          return res.json({ furnit: ft, imgUrl: finalFile});
        }
      }
      if (!fl || fl.length === 0) {
        finalFile[index] = null;
        if (Object.keys(finalFile).length === pic_ids.length) {
          return res.json({ furnit: ft, imgUrl: finalFile});
        }
      } else {
        let contentType = fl.contentType;
        collectionChunks.find({files_id: ObjectId(pic)}).sort({ n: 1}).toArray(function(err, chunks) {
          if(err){
            finalFile[index] = null;
            if (Object.keys(finalFile).length === pic_ids.length) {
              return res.json({ furnit: ft, imgUrl: finalFile});
            }
         }
          if(!chunks || chunks.length === 0){
            finalFile[index] = null;
            if (Object.keys(finalFile).length === pic_ids.length) {
              return res.json({ furnit: ft, imgUrl: finalFile});
            }
          }
          let fileData = [];
          for (let i=0; i<chunks.length;i++) {
            fileData.push(chunks[i].data.toString('base64'));
          }
          finalFile[index] = 'data:' + fl.contentType + ';base64,' + fileData.join('');
          let len = Object.keys(finalFile).length;
          if (len === picture_ids.length) {
            res.json({imgUrl: finalFile});
          }
        });
      }
      });
    });
}

router.get('/images/:pic_ids', function (req, res) {
  console.log('getIdentidyFromUrl');
  console.log('ZZ');
  let db = mongoose.connection.db;
  let collectionChunks = db.collection('uploads.chunks');
  let furnits = db.collection('furnits');
  let picture_ids = req.params.pic_ids.split(',');
  return retrieveImgUrlFromPictureIds(picture_ids, req, res);
});


//ORIGINAL 
router.get('/:furnit_id', function (req, res) {
  console.log('getIdentidyCardFurnit');
  let db = mongoose.connection.db;
  let collectionChunks = db.collection('uploads.chunks');
  let furnit_id = ObjectId(req.params.furnit_id);
  console.log(furnit_id);
  db.collection("furnits").aggregate([
    { "$match": { "_id": furnit_id } },
    { 
        "$lookup": { 
            "from": 'users', 
            "localField": 'owner_id', 
            "foreignField": '_id', 
            "as": 'owner' 
        } 
    }]).next(function(err, ft) {
      console.log('FURNIT APRES MATCH');
      console.log(ft);
    if(err){
      return res.status(404).json({
          err: 'Erreur de requete'
      });
    } else if(!ft || ft.length === 0){
      return res.status(404).json({
        err: 'Ce meuble nexiste pas'
      });
    } else {
      let pic_ids = ft.picture_ids;
      var finalFile = {};
      if (pic_ids && pic_ids.length > 0) {
      pic_ids.forEach(function(pid, index) {
        gfs.files.findOne({ _id: ObjectId(pid)}, (err, fl) => {
        if(err){
            finalFile[index] = null;
            if (Object.keys(finalFile).length === pic_ids.length) {
              return res.json({ furnit: ft, imgUrl: finalFile});
            }
        } else if (!fl || fl.length === 0) {
          finalFile[index] = null;
          if (Object.keys(finalFile).length === pic_ids.length) {
            return res.json({ furnit: ft, imgUrl: finalFile});
          }
        } else {
          let fileData = [];
          collectionChunks.find({files_id: fl._id}).sort({n: 1}).toArray(function(err, chunks){
          if(err){
            finalFile[index] = null;
            if (Object.keys(finalFile).length === pic_ids.length) {
              return res.json({ furnit: ft, imgUrl: finalFile});
            }
          } else if(!chunks || chunks.length === 0) {
            //No data found
            finalFile[index] = null;
            if (Object.keys(finalFile).length === pic_ids.length) {
              return res.json({ furnit: ft, imgUrl: finalFile});
            }
          } else {
            for (let i = 0; i < chunks.length; i++) {
              fileData.push(chunks[i].data.toString('base64'));
            }
            finalFile[index] = 'data:' + fl.contentType + ';base64,' + fileData.join('');
            // finalFile.push('data:' + fl.contentType + ';base64,' + fileData.join(''));
            if (Object.keys(finalFile).length === pic_ids.length) {
              return res.json({ furnit: ft, imgUrl: finalFile});
            }
          }
      });
    };
  });
    });
  } else {
    console.log('Ce meuble n a pas de photos');
    console.log(ft)
    return res.status(201).json({ furnit: ft, imgUrl: {}});
  }
  }
});
});





module.exports = router;