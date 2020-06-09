let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const formatMessage = require('./utils/messages');
// const mongo = require('mongodb').MongoClient; //mongodb driver
const mongoose = require('mongoose');
const URI = require('./config/keys').URI;
const botName = 'lendle info';
const Chat = require('../model/Chat');


mongoose.connect( URI, { dbName: 'furniture-loan', useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
        throw err;
    }
    // console.log('connected to the DB'),

    io.on('connection', (socket) => {
        console.log('a user connected');

        //get the data in the db chats
        let chats = mongoose.connection.db.collection('chats');
        chats.find().limit(100).sort({ 'time': 1}).toArray(function(err, res){
            if (err) {
                throw err;
            }
            console.log('there is an output')
            // console.log(res);
            socket.emit('output', res);
        });

        //Welcome current user
        socket.emit('message', formatMessage(botName, '', 'Welcome to chat '));
        //A user has joined the chat
        socket.broadcast.emit('message', formatMessage(botName, '', 'A user has joined the chat'));

        socket.on('disconnect', () => {
            console.log('Disconnected');
            io.emit('message', formatMessage(botName, 'A user has left the chat'));
        });
        //If a user wrote a message
        socket.on('chatMessage', data => {
            console.log(data);
            data.time = new Date();
            chats.insertOne(data);
            io.emit('chatMessage', data);
        })

    }),

    http.listen(3000, () => {
        console.log('Listening on port *: 3000');
    }),
   console.log('Connected to the db');
});


app.get('/', (req, res) => {
    res.json({ prop: 'test'});
});


