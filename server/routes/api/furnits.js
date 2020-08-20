const express = require('express');
const mongodb = require('mongodb'); //mongodb driver
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


// Connexion

// const conn = mongoose.createConnection(URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( URI, { dbName: 'furniture-loan', useNewUrlParser: true, useUnifiedTopology: true }, ()=> console.log('connected to DB'));
// mongoose.connection.on('connected', () => {
//   console.log('Connexion is on');
// });

// Init gfs
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

// Retrieve one picture for a list of furnits

// function retrievePicturesMemory(furnits, req, res) {
//   let db = mongoose.connection.db;
//   let collectionChunks = db.collection('uploads.chunks');
//   let picture_ids = [];
//   let finalFile = [];
//   furnits.forEach(function(furn){
//     if (furn.picture_ids.length > 0) picture_ids.push(furn.picture_ids[0]);
//     else picture_ids.push(-1);
//   });
//   console.log('Picture_ids');
//   console.log(picture_ids);
//   furnits.forEach(function(ft, index) {
//     if (ft.picture_ids[0] && ft.picture_ids[0] !== -1) {
//       console.log('Object Id à chercher');
//       let id = ObjectId(ft.picture_ids[0]);
//       console.log(id);
//       gfs.files.findOne({ _id: id }, (err, fl) => {
//         console.log(fl);
//         if (!fl || fl.length === 0) {
//           return ft
//         } else {
//           let contentType = fl.contentType;
//           collectionChunks.find({files_id: id}).sort({ n: 1}).toArray(function(err, chunks) {
//           if(err){
//             return ft
//           }
//           if(!chunks || chunks.length === 0){
//             return ft
//           }
//           let fileData = [];
//           for (let i = 0; i < chunks.length; i++) {
//             fileData.push(chunks[i].data.toString('base64'));
//           }
//           finalFile[index] = 'data:' + contentType + ';base64,' + fileData.join('');
//           console.log('length of imgUrl');
//           let len = Object.keys(finalFile).length;
//           if (index === 4) {
//             console.log(len);
//             console.log(picture_ids.length);
//           }
//           console.log(len);
//           console.log(picture_ids.length);
//           if (len === picture_ids.length) {
//             console.log('END');
//             res.json({furnits: furnits, imgUrl: finalFile}); 
//           }
//       });
//   }
// });
// } else {
//   finalFile[index] = 'null';
//   console.log(Object.keys(finalFile).length);
//   console.log(picture_ids.length);
//   if (Object.keys(finalFile).length === picture_ids.length) {
//     res.json({furnits: furnits, imgUrl: finalFile}); }
// }
// });
// }

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
        console.log(fl);
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

//appeler pour searchComponent
// router.get('/search', function (req, res) {
//   let db = mongoose.connection.db;
//   let params = {};

//   if (req.query.type) params.type = req.query.type
//   if (req.query.city) params.city = req.query.city
//   // if (req.query.word) params.word = req.query.word
//   if (req.query.id) params._id = req.query.id
//   console.log(req.query);
//   console.log(params);
//   db.collection("furnits").find(params).toArray(function(err, furnits) {
//     if(err){
//       return res.json({ msg: 'erreur de requete'});
//     } else if(!furnits || furnits.length === 0){
//       return res.json({ msg: 'pas de resultat'});
//     } else {
//       // we have to retrieve one picture of each furnit
//       return retrievePictures(furnits, req, res);
//     }
//   });
// });


// router.get('/', function (req, res) {
//   let db = mongoose.connection.db;
//   console.log(req.query);
//   let word = '';
//   let city = '';
//   let type = '';
//   if (req.query.word) word = req.query.word;
//   if (req.query.type) type = req.query.type;
//   if (req.query.city) city = req.query.city;
//   const regex_word = new RegExp(word);
//   const regex_type = new RegExp(type);
//   const regex_city = new RegExp(city);
//   console.log('Les queries de la requete :');
//   console.log(word);
//   console.log(type);
//   console.log(city);
//   console.log('Les regex :');
//   console.log(regex_word);
//   console.log(regex_type);
//   console.log(regex_city);

//   db.collection("furnits").aggregate([
//     { "$match": { 
//       $and: [
//       { type: {$regex: regex_type}},
//       { city: {$regex: regex_city}},
//       { $or: [ {name: { $regex: regex_word }}, { type: { $regex: regex_word } }, { description: { $regex: regex_word } }]}
//       ]}}
//   ]).toArray(function(err, furnits) {
//       console.log(furnits);
//     if(err){
//       return res.status(404).json({
//           err: 'Erreur de recherche de meubles'
//       });
//     } else if(!furnits || furnits.length === 0){
//       return res.json({furnits: {}, imgUrl: {}});
//     } else {
//       return retrievePictures(furnits, req, res);
//         }
//     });
// });


router.get('/rent', function (req, res) {
  let db = mongoose.connection.db;
  console.log('user');
  console.log(req.user);
  let id = ObjectId(req.user._id.toString());

  db.collection("furnits").find({owner_id: id}).toArray(function(err, furnits) {
    console.log('FURNITS');
    console.log(furnits);
    if(err){
      return res.json({ msg: 'erreur de requete'});
    } else if(!furnits || furnits.length === 0){
      return res.json({ msg: 'pas de resultat'});
    } else {
      // we have to retrieve one picture of each furnit
      return retrievePictures(furnits, req, res);
    }
  });
});


router.get('/files', function (req, res) {
  gfs.files.find().toArray(((err, files) => {
    if (!files || files.length === 0) {
      res.render('index', { files: false});
      } else {
        files.map(file => {
          if (file.contentType === 'image/jpeg' ||
        file.contentType === 'image/png')
        {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
    }
    // Files exist
    res.json({ files });
  }))
});


router.get('/files/:filename', function (req, res) {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No files exists'
      });
    }
    // File exists
    return res.json(file);
  })
});

router.get('/image/:filename', function (req, res) {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No files exists'
      });
    }
    // File exists
    if (file.contentType === 'image/jpeg' || file.contentType === 'img/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  })
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
  let db = mongoose.connection.db;
  let collectionChunks = db.collection('uploads.chunks');
  let furnits = db.collection('furnits');
  let picture_ids = req.params.pic_ids.split(',');
  return retrieveImgUrlFromPictureIds(picture_ids, req, res);
});
//   var finalFile = {};
//   picture_ids.forEach(function(pic, index){
//     gfs.files.findOne({ _id: ObjectId(pic) }, (err, fl) => {
//       if (err) {

//       }
//       if (!fl || fl.length === 0) {
//         return res.status(404).render({error: err.errMsg});
//       } else {
//         let contentType = fl.contentType;
//         collectionChunks.find({files_id: id}).sort({ n: 1}).toArray(function(err, chunks) {
//           if(err){
//             return res.status(404).render({
//               error: err.errmsg});
//          }
//           if(!chunks || chunks.length === 0){
//             return res.status(404).render({
//               error: err.errmsg});
//           }
//           let fileData = [];
//           for (let i=0; i<chunks.length;i++) {
//             fileData.push(chunks[i].data.toString('base64'));
//           }
//           finalFile[index] = 'data:' + fl.contentType + ';base64,' + fileData.join('');
//           // finalFile.push('data:' + contentType + ';base64,' + fileData.join(''));
//           let len = Object.keys(finalFile).length;
//           if (len === picture_ids.length) {
//             res.json({imgUrl: finalFile});
//           }
//         });
//       }
//       });
//     });
//   });


//ORIGINAL 
// router.get('/identity/:furnit_id', function (req, res) {
//   console.log('getIdentidyCardFurnit');
//   let db = mongoose.connection.db;
//   let collectionChunks = db.collection('uploads.chunks');
//   let furnit_id = ObjectId(req.params.furnit_id);
//   console.log(furnit_id);
//   db.collection("furnits").aggregate([
//     { "$match": { "_id": furnit_id } },
//     { 
//         "$lookup": { 
//             "from": 'users', 
//             "localField": 'owner_id', 
//             "foreignField": '_id', 
//             "as": 'owner' 
//         } 
//     }]).next(function(err, ft) {
//       console.log('FURNIT APRES MATCH');
//       console.log(ft);
//     if(err){
//       return res.status(404).json({
//           err: 'Erreur de requete'
//       });
//     } else if(!ft || ft.length === 0){
//       return res.status(404).json({
//         err: 'Ce meuble nexiste pas'
//       });
//     } else {
//       let pic_ids = ft.picture_ids;
//       var finalFile = {};
//       if (pic_ids && pic_ids.length > 0) {
//       pic_ids.forEach(function(pid, index) {
//         gfs.files.findOne({ _id: ObjectId(pid)}, (err, fl) => {
//         if(err){
//             finalFile[index] = null;
//             if (Object.keys(finalFile).length === pic_ids.length) {
//               return res.json({ furnit: ft, imgUrl: finalFile});
//             }
//         } else if (!fl || fl.length === 0) {
//           finalFile[index] = null;
//           if (Object.keys(finalFile).length === pic_ids.length) {
//             return res.json({ furnit: ft, imgUrl: finalFile});
//           }
//         } else {
//           let fileData = [];
//           collectionChunks.find({files_id: fl._id}).sort({n: 1}).toArray(function(err, chunks){
//           if(err){
//             finalFile[index] = null;
//             if (Object.keys(finalFile).length === pic_ids.length) {
//               return res.json({ furnit: ft, imgUrl: finalFile});
//             }
//           } else if(!chunks || chunks.length === 0) {
//             //No data found
//             finalFile[index] = null;
//             if (Object.keys(finalFile).length === pic_ids.length) {
//               return res.json({ furnit: ft, imgUrl: finalFile});
//             }
//           } else {
//             for (let i = 0; i < chunks.length; i++) {
//               fileData.push(chunks[i].data.toString('base64'));
//             }
//             finalFile[index] = 'data:' + fl.contentType + ';base64,' + fileData.join('');
//             // finalFile.push('data:' + fl.contentType + ';base64,' + fileData.join(''));
//             if (Object.keys(finalFile).length === pic_ids.length) {
//               return res.json({ furnit: ft, imgUrl: finalFile});
//             }
//           }
//       });
//     };
//   });
//     });
//   } else {
//     console.log('Ce meuble n a pas de photos');
//     console.log(ft)
//     return res.status(201).json({ furnit: ft, imgUrl: {}});
//   }
//   }
// });
// });



// Add File

router.post('/upload', upload.array('file'), (req, res) => {
  // insertFile(req.body.file, res)
  res.json({ file: req.files});
});


// Poster un meuble - Post a furniture

router.post('/', function (req, res) {
  var furnit = new Furnit();
  console.log('Post a furnit');
  console.log(req.body);
  console.log(req.user);
  let id = req.user._id.toString();
  furnit.name = req.body.name;
  furnit.owner_id = req.user.id;
  furnit.type = req.body.type;
  furnit.loanstart = req.body.dateStart;
  furnit.loanend = req.body.dateEnd;
  furnit.city = req.body.city;
  furnit.state = req.body.state;
  furnit.price = req.body.price;
  furnit.description = req.body.description;
  furnit.creation = new Date();
  furnit.picture_ids = req.body.picture_ids;
  furnit.save(function (err) {
    if (err) {
      console.log('Error');
      res.send(err);
    }
    res.send('Bravo, votre meuble a été ajouté');
  });
});

router.post('/update', function (req, res) {
  console.log('QUERIES');
  console.log(req.body);
  console.log(req.user);
  // let furnit = req.params.ad;
  let { _id, name, price, type, loanstart, loanend, city, state, description, picture_ids} = req.body;
  console.log(name);
  console.log(price);
  console.log(type);
  console.log(loanstart);
  console.log(loanend);
  console.log(city);
  console.log(state);
  console.log(description);
  console.log(picture_ids);
  let db = mongoose.connection.db;

  db.collection("furnits").updateOne(
    { "_id" : ObjectId(_id) },
      [{ $set: { "name": name, "price": price, "state": state, "description": description, "loanstart": loanstart, "loanend": loanend, "type": type, "city": city, "picture_ids": picture_ids }}]
 , function (err, rsp) {
    res.status(201).json({ msg: 'L annonce a bien été mise à jour'});
 });
});

  // furnit.save(function (err) {
  //   if (err) {
  //     console.log('Error');
  //     res.send(err);
  //   }
  //   res.send('Bravo, votre meuble a été ajouté');
  // });

// Delete Files (upload.files and upload.chunks)of the furniture deleted

router.delete('/files/:files_id', function (req, res) {
  console.log('DELETE');
  console.log(req.params.files_id);
  let picture_ids = req.params.files_id.split(',')
  picture_ids.forEach(function(elt){
    let el = ObjectId(elt);
    let db = mongoose.connection.db;
    let collectionChunks = db.collection('uploads.chunks');
    gfs.files.deleteOne({ _id: el});
    collectionChunks.find({ files_id: el}).toArray((err, chks) => {
      chks.forEach(function(chk){
        let chkId = ObjectId(chk._id);
        console.log(chkId);
        collectionChunks.deleteOne({ _id: chkId});
      });
    });
  });
});

router.delete('/:furnit_id', function (req, res) {
  let id = ObjectId(req.params.furnit_id );
  Furnit.deleteOne( { _id: id } , function (err) {
    if (err) {
      res.send(err);
    }
    res.send('Bravo, votre meuble a été supprimé');
  });
});


module.exports = router;