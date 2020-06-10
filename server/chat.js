let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const formatMessage = require('./utils/messages');
// const mongo = require('mongodb').MongoClient; //mongodb driver
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
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

        //get the name of the people the user talks to (in the db dialog)
        let chats = mongoose.connection.db.collection('chats');
        let dialogs = mongoose.connection.db.collection('dialogs');
        socket.on('getInterlocutors', (dataUser) => {
            console.log('getMessagesIntoDb');
            if (dataUser.loaner === true) {
                dialogs.aggregate([
                    { "$match": { "loaner_id": ObjectId(dataUser.id) } },
                    { "$project": { "renter_id": 1, "furnit_id": 1 } },
                    { "$sort" : { 'last_talk' : 1} },
                    { "$lookup": {
                        "from": "users",
                        "let": { "id": "$renter_id" },
                        "pipeline": [
                          { "$match": { "$expr": { "$eq": ["$_id", "$$id"] }}},
                          { "$project": { "firstname": 1, "lastname": 1 }}
                        ],
                        "as": "to"
                        }
                      },
                      { "$lookup": {
                        "from": "furnits",
                        "let": { "id": "$furnit_id" },
                        "pipeline": [
                          { "$match": { "$expr": { "$eq": ["$_id", "$$id"] }}},
                          { "$project": { "name": 1, "type": 1 }}
                        ],
                        "as": "furnit"
                      }
                    }
                ]).toArray(function(err, interlocutors) {
                        if (err) {
                            throw err;
                        } else {
                            socket.emit('interlocutors', interlocutors);
                        }
                    });
            } else {
                console.log('is a renter');
                dialogs.aggregate([
                    { "$match": { "renter_id": ObjectId(dataUser.id) } },
                    { "$project": { "loaner_id": 1, "furnit_id": 1} },
                    { "$sort" : { 'last_talk' : 1} },
                    { "$lookup": {
                        "from": "users",
                        "let": { "id": "$loaner_id" },
                        "pipeline": [
                          { "$match": { "$expr": { "$eq": ["$_id", "$$id"] }}},
                          { "$project": { "firstname": 1, "lastname": 1 }}
                        ],
                        "as": "to"
                      }
                    },
                    { "$lookup": {
                        "from": "furnits",
                        "let": { "id": "$furnit_id" },
                        "pipeline": [
                          { "$match": { "$expr": { "$eq": ["$_id", "$$id"] }}},
                          { "$project": { "name": 1, "type": 1 }}
                        ],
                        "as": "furnit"
                      }
                    },
                ]).toArray(function(err, interlocutors) {
                    console.log(interlocutors);
                        if (err) {
                            throw err;
                        } else if (!interlocutors || interlocutors.length === 0){
                            socket.emit('interlocutors', []);
                        } else {
                            socket.emit('interlocutors', interlocutors);
                        }
                    });
            }
        });
            
            socket.on('getChat', (dialog_id) => {
                console.log(dialog_id);
                chats.find({dialog_id: ObjectId(dialog_id)}).limit(100).sort({ 'time': 1}).toArray(function(err, res){
                    if (err) {
                        throw err;
                    }
                    console.log('there is an output')
                    console.log(res);
                    socket.emit('output', res);
                });
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
            data.dialog_id = ObjectId(data.dialog_id);
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


