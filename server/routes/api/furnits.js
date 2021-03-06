const express = require('express');
const mongodb = require('mongodb'); //mongodb driver
const mongoose = require('mongoose');
const Furnit = require('../../../model/Furnit');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();


// Connexion
const URI = 'mongodb+srv://Alex3:Alex3@cluster0-pbmzu.mongodb.net/furniture-loan?retryWrites=true&w=majority';

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

router.get('/', function (req, res) {
  Furnit.find(function (err, furnits) {
    if (err) {
      console.log('err');
      res.send(err);
    }
    res.json(furnits);
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

router.get('/furn/:pic_ids', function (req, res) {
  // databases
  let db = mongoose.connection.db;
  let collectionChunks = db.collection('uploads.chunks');
  let furnits = db.collection('furnits');
  let picture_ids = req.params.pic_ids.split(',');
  var finalFile = new Array();
  picture_ids.forEach(function(pic){
  let id = ObjectId(pic);
  gfs.files.findOne({ _id: id }, (err, fl) => {
    if (!fl || fl.length === 0) {
      return res.status(404).render({error: err.errMsg});
    } else {
      let contentType = fl.contentType;
      collectionChunks.find({files_id: id}).sort({ n: 1}).toArray(function(err, chunks) {
        if(err){
          return res.status(404).render({
            error: err.errmsg});
        }
        if(!chunks || chunks.length === 0){
          return res.status(404).render({
            error: err.errmsg});
        }
        let fileData = [];
        for (let i=0; i<chunks.length;i++) {
          fileData.push(chunks[i].data.toString('base64'));
        }
        finalFile.push('data:' + contentType + ';base64,' + fileData.join(''));
        if (finalFile.length === picture_ids.length) { res.json({imgurl: finalFile}); }
      });
    }
    });
    console.log(finalFile);
  });
  
});

router.get('/images/SAP', function (req, res) {
  let db = mongoose.connection.db;
  let up = db.collection('uploads');
  let collectionChunks = db.collection('uploads.chunks');
  gfs.files.findOne({}, (err, file) => {
    if (!file || file.length === 0) {
      return res.render('index', {
            title: 'File error', 
            message: 'Error finding file', 
              error: err.errMsg});
    }
    if(!file || file.length === 0){
      return res.render('index', {
        title: 'Download Error', 
        message: 'No file found'});
    } else {
    collectionChunks.find({files_id: file._id}).toArray(function(err, chunks){
        if(err){
            return res.render('index', {
            title: 'Download Error', 
            message: 'Error retrieving chunks', 
            error: err.errmsg});
          }
        if(!chunks || chunks.length === 0){
          //No data found
          return res.render('index', {
            title: 'Download Error', 
            message: 'No data found'});
        }
    let fileData = [];
    for (let i=0; i<chunks.length;i++) {
      //This is in Binary JSON or BSON format, which is stored
      //in fileData array in base64 endocoded string format
      fileData.push(chunks[i].data.toString('base64'));
    }
    //Display the chunks using the data URI format
    let finalFile = 'data:' + file.contentType + ';base64,'
          + fileData.join('');
    res.json({
      imgurl: finalFile});
    });
  };
});
});


router.get('/images', function (req, res) {
  let db = mongoose.connection.db;
  let up = db.collection('uploads');
  let collectionChunks = db.collection('uploads.chunks');
  gfs.files.find({}, (err, fls) => {
    if (!fls || fls.length === 0) {
      return res.render('index', {
            title: 'File error', 
            message: 'Error finding file', 
              error: err.errMsg});
    }
    if(!fls || fls.length === 0){
      return res.render('index', {
        title: 'Download Error', 
        message: 'No file found'});
    } else {
      // console.log(fls)
      var finalFile = new Array();
      fls.forEach(function(fl){
        let fileData = [];
        collectionChunks.find({files_id: fl._id}).toArray(function(err, chunks){
        if(err){
            return res.render('index', {
            title: 'Download Error',
            message: 'Error retrieving chunks',
            error: err.errmsg});
          }
        if(!chunks || chunks.length === 0){
          //No data found
          return res.render('index', {
            title: 'Download Error', 
            message: 'No data found'});
        }
        
    for (let i=0; i<chunks.length;i++) {
      //This is in Binary JSON or BSON format, which is stored
      //in fileData array in base64 endocoded string format
      fileData.push(chunks[i].data.toString('base64'));
      }
      
      finalFile.push('data:' + fl.contentType + ';base64,'
         + fileData.join(''));
      //finalFile.push(i);
      console.log(finalFile);
    });
    //Display the chunks using the data URI format
    
   console.log(finalFile);
  });
  // finalFile.push('omelette:');
  //console.log(finalFile);
    res.json({
      imgurl: finalFile});
    }
  });
});
  

// Add File

router.post('/upload', upload.array('file'), (req, res) => {
  // insertFile(req.body.file, res)
  res.json({ file: req.files});
});

// function insertFile(file, res) {
//   let db = mongoose.connection.db;
//   let collection = db.collection('uploads');
//   try {
//     collection.insertOne(file);
//   }
//   catch(err) {
//     console.log(err);
//   }
// }


// Poster un meuble - Post a furniture

router.post('/', function (req, res) {
  var furnit = new Furnit();
  
  furnit.name = req.body.name;
  furnit.owner_id = req.body.owner_id;
  furnit.type = req.body.type;
  furnit.loanstart = req.body.dateStart;
  furnit.loanend = req.body.dateEnd;
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

// Delete Files (upload.files and upload.chunks)of the furniture deleted

router.delete('/files/:files_id', function (req, res) {
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