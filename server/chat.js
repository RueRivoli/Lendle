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
    let dialog;
    io.on('connection', (socket) => {
        console.log('a user connected');

        //get the name of the people the user talks to (in the db dialog)
        let chats = mongoose.connection.db.collection('chats');
        let dialogs = mongoose.connection.db.collection('dialogs');
        let furnits = mongoose.connection.db.collection('furnits');

        //Check if user want to speak to somebody at first and create dialog if doesnt exist
        socket.on('addNewInterlocutor', (dataUser) => {
            console.log('getMessagesIntoDb');
            //if the user wants to speak to somebody in particular
            console.log(dataUser.interlocutor_id);
            let  itl_id = dataUser.interlocutor_id;
            if (itl_id) {
                console.log("User wants to speak to a specific person");
                console.log(dataUser.interlocutor_id);
                if (dataUser.loaner) {
                    console.log('The curent user is a locataire');
                    dialogs.findOne({renter_id: ObjectId(itl_id), loaner_id: ObjectId(dataUser.id) }, (err, dl) => {
                        console.log('Dialog entre user et interlocutor wanted');
                        console.log(dl);
                        if (err) {
                            console.log("Erreur dans la recherche de dialog entre les 2 utilisateurs");
                            socket.emit('updateInterlocutors');
                            throw err;
                        //if dialog hasn't be created with the user we want to speak to 
                        } else if (!dl || dl.length === 0) {
                            let new_dialog = {
                                loaner_id: ObjectId(dataUser.id),
                                renter_id: ObjectId(itl_id),
                                furnit_id: new Array(ObjectId(dataUser.furnit_id)),
                                last_talk: new Date()
                            }
                            console.log('New dialog created');
                            console.log(new_dialog);
                            dialogs.insertOne(new_dialog, (err, result) => {
                                console.log('Dialog inséré');
                                console.log(result.ops);
                                let firstMessage = {
                                    author_id: dataUser.id,
                                    dest_id: result.ops[0].renter_id,
                                    // mail: this.mail,
                                    text: "J'aimerais entrer en contact avec vous (message automatique)",
                                    dialog_id: result.ops[0]._id
                                  }
                                  chats.insert(firstMessage);
                                  console.log('firstMessage');
                                  console.log(firstMessage);
                            });
                           socket.emit('updateInterlocutors');
                        } else {
                            // Dialog has been iniciated
                            if (dl.furnit_id.includes(dataUser.furnit_id)) {
                                socket.emit('updateInterlocutors');
                            } else {
                                let new_array = dl.furnit_id;
                                new_array.push(ObjectId(dataUser.furnit_id));
                                dialogs.updateOne(
                                    { _id : ObjectId(dl._id) },
                                    { $set: { "furnit_id" : new_array } }
                                 );
                                 socket.emit('updateInterlocutors');
                            }
                        }
                    });
                } else {
                    console.log('The current user is a bailleur');
                    dialogs.findOne({loaner_id: ObjectId(itl_id), renter_id: ObjectId(dataUser.id)}, (err, dl) => {
                        console.log('Dialog between user and interlocutor wanted');
                        console.log(dl);
                        if (err) {
                            console.log("Erreur dans la recherche de dialog entre les 2 utilisateurs");
                            socket.emit('updateInterlocutors');
                            throw err;
                        } else if (!dl || dl.length === 0) {
                            let new_dialog = {
                                renter_id: ObjectId(dataUser.id),
                                loaner_id: ObjectId(itl_id),
                                furnit_id: new Array(ObjectId(dataUser.furnit_id)),
                                last_talk: new Date()
                            }
                            console.log('New dialog created');
                            console.log(new_dialog);
                            dialogs.insertOne(new_dialog, (err, result) => {
                                console.log('Dialog inséré');
                                console.log(result.ops);
                                let firstMessage = {
                                    author_id: dataUser.id,
                                    dest_id: result.ops[0].loaner_id,
                                    // mail: this.mail,
                                    text: "J'aimerais entrer en contact avec vous (message automatique)",
                                    dialog_id: result.ops[0]._id
                                  }
                                  chats.insert(firstMessage);
                                  console.log('firstMessage');
                                  console.log(firstMessage);
                            });
                           socket.emit('updateInterlocutors');
                        } else {
                            if (dl.furnit_id.includes(dataUser.furnit_id)) {
                                socket.emit('updateInterlocutors');
                            } else {
                                let new_array = dl.furnit_id;
                                new_array.push(ObjectId(dataUser.furnit_id));
                                dialogs.updateOne(
                                    { _id : ObjectId(dl._id) },
                                    { $set: { "furnit_id" : new_array } }
                                 );
                                 socket.emit('updateInterlocutors');
                            }
                        }
                    });
                }
            }
        });
        socket.on('getInterlocutors', (dataUser) => {
            if (dataUser.loaner === true) {
                console.log('User is a loaner');
                console.log(dataUser.id);
                dialogs.aggregate([
                    { "$match": { "loaner_id": ObjectId(dataUser.id) } },
                    { "$project": { "renter_id": 1, "furnit_id": 1 } },
                    { "$sort" : { 'last_talk' : 1} },
                    { "$lookup": {
                        "from": "users",
                        "let": { "id": "$renter_id" },
                        "pipeline": [
                          { "$match": { "$expr": { "$eq": ["$_id", "$$id"] }}},
                          { "$project": { "firstname": 1, "lastname": 1, "username": 1, "_id": 0 }}
                        ],
                        "as": "to"
                        }
                      },
                      { "$lookup": {
                        "from": "furnits",
                        "localField": "furnit_id",
                        "foreignField": "_id",
                        "as": "furnit"
                      }
                    },
                    { $unwind: "$to" },
                    // { $unwind: "$furnit" },
                        { 
                            $set: { interlocutor_firstname: "$to.firstname",
                            interlocutor_lastname: "$to.lastname", interlocutor_username: "$to.username", interlocutor_id: "$renter_id",
                            dialog_id: "$_id"
                        } 
                    },
                    { $unset: ["to","renter_id", "_id" ] },
                    // {
                    //     "$bucket": {
                    //         "groupBy": "$renter_id" ,
                    //         boundaries: [ 1840, 1850, 1860, 1870, 1880 ],                       // Field to group by
                    //         // "default": "Other",                             // Bucket id for documents which do not fall into a bucket
                    //         // "output": {                                     // Output for each bucket
                    //         //   "count": { $sum: 1 },
                    //         // //   "artists" :
                    //         // //     {
                    //         // //       $push: {
                    //         // //         "name": { $concat: [ "$first_name", " ", "$last_name"] },
                    //         // //         "year_born": "$year_born"
                    //         // //       }
                    //         // //     }
                    //         // }
                    //     }
                    // },
            //         { "$group": { _id: "$renter_id", furnit: {$push:"$furnit"}, interlocutor_id : { $first: '$renter_id' },
            //         firstname : { $first: '$firstname' }, lastname : { $first: '$lastname' }, username : { $first: '$username' },
            //     }
            // },
                ]).toArray(function(err, interlocutors) {
                    console.log('INTERLOCUTORS');
                    console.log(interlocutors);
                        if (err) {
                            throw err;
                        } else {
                            socket.emit('interlocutors', interlocutors);
                        }
                    });
            } else {
                console.log('User is a bailleur');
                console.log(dataUser.id);
                dialogs.aggregate([
                    { "$match": { "renter_id": ObjectId(dataUser.id) } },
                    { "$project": { "loaner_id": 1, "furnit_id": 1} },
                    { "$sort" : { 'last_talk' : 1} },
                    { "$lookup": {
                        "from": "users",
                        "let": { "id": "$loaner_id" },
                        "pipeline": [
                          { "$match": { "$expr": { "$eq": ["$_id", "$$id"] }}},
                          { "$project": { "firstname": 1, "lastname": 1, "_id": 0  }}
                        ],
                        "as": "to"
                      }
                    },
                    { "$lookup": {
                        "from": "furnits",
                        "localField": "furnit_id",
                        "foreignField": "_id",
                        "as": "furnit"
                      }
                    },
                    { $unwind: "$to" },
                    // { $unwind: "$furnit" },
                        { 
                            $set: { interlocutor_firstname: "$to.firstname",
                            interlocutor_lastname: "$to.lastname", interlocutor_username: "$to.username", interlocutor_id: "$loaner_id",
                            dialog_id: "$_id"
                        } 
                    },
                    { $unset: ["to","loaner_id", "_id" ] },
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
            
        socket.on('getNewInterlocutor', (furnit_id) => {
                console.log('The new interlocutor is a renter because loaners speak first');
                console.log('Meuble num');
                console.log(furnit_id);
                furnits.aggregate([
                    { "$match": { "_id": ObjectId(furnit_id) } },
                    { "$project": { "owner_id": 1, "name": 1, "type": 1 } },
                    { "$lookup": {
                        "from": "users",
                        "let": { "id": "$owner_id" },
                        "pipeline": [
                          { "$match": { "$expr": { "$eq": ["$_id", "$$id"] }}},
                          { "$project": { "firstname": 1, "lastname": 1 }}
                        ],
                        "as": "to"
                        }
                      },
                ]).toArray(function(err, newItlc) {
                    console.log('The new interlocutor');
                    console.log(newItlc);
                        if (err) {
                            throw err;
                        } else {
                            socket.emit('newInterlocutor', newItlc);
                        }
                    });
        });

            socket.on('getChat', (dialog_id) => {
                let room_name = 'room_' + dialog_id;
                socket.join(room_name);
                console.log('room_name');
                console.log(room_name);
                chats.find({dialog_id: ObjectId(dialog_id)}).limit(100).sort({ 'time': 1}).toArray(function(err, res){
                    if (err) {
                        throw err;
                    }
                    socket.emit('allChat', res);
                });
        });

       

        //Welcome current user
        // socket.emit('message', formatMessage(botName, '', 'Welcome to chat '));
        //A user has joined the chat
        // socket.broadcast.emit('message', formatMessage(botName, '', 'A user has joined the chat'));

        socket.on('disconnect', () => {
            console.log('Disconnected');
            io.emit('message', formatMessage(botName, 'A user has left the chat'));
        });
        //If a user wrote a message
        socket.on('newMessage', data => {
            console.log('NEW MESSAGE');
            console.log(data);
            data.dialog_id = ObjectId(data.dialog_id);
            data.dest_id = ObjectId(data.dest_id);
            data.author_id = ObjectId(data.author_id);
            data.time = new Date();
            chats.insertOne(data);
            dialogs.updateOne(
                { _id : ObjectId(data.dialog_id) },
                { $set: { "last_talk" : data.time  } }
             );
            let room_name = 'room_' + data.dialog_id;
            // io.emit('newMessage', data);
            console.log('Envoie son message dans room_name:');
            console.log(room_name);
            io.in(room_name).emit('newMessage', data);
        })

    }),

    http.listen(3000, () => {
        console.log('Listening on port *: 3000');
    }),
   console.log('Connected to the db');
});



