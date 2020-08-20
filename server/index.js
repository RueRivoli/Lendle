
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
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(passport.initialize());

const chat = require('./chat');
const furnits = require('./routes/api/furnits');
const searchfurnits = require('./routes/api/searchfurnits');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const rentals = require('./routes/api/rentals');


app.use('/api/auth', auth);
app.use('/api/users', passport.authenticate('jwt', {session: false}), users);
app.use('/api/rentals', passport.authenticate('jwt', {session: false}), rentals);
app.use('/api/furnits/search', searchfurnits); //access to people disconnected
app.use('/api/furnits', passport.authenticate('jwt', {session: false}), furnits);
// app.use('/api/users', users)



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
