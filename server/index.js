//to run our server

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream')
const methodOverride = require('method-override');
const passport = require('passport');
const passportJwt = require('passport-jwt');
require('./config/passport')(passport);
var cookieParser = require('cookie-parser')

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cors());
app.use(cookieParser());

app.use(passport.initialize());


const furnits = require('./routes/api/furnits');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');


app.use('/api/furnits', furnits);
app.use('/api/auth', auth);//register login 
// app.use('/api/users', passport.authenticate('jwt', {session: false}), users);//profile...
app.use('/api/users', users)

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8080/"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));