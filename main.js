// Package requirements

const express   = require('express');
const hbs       = require('express-handlebars');
const http      = require('http');
const socket    = require('socket.io');

const chat      = require('./classes.js');
const config    = require('./server-config.json');


// Caches Setup

let cached_users = new Map();


// Express initialization

let app = express();

app.engine('handlebars', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/resources', express.static(__dirname + '/views/resources'));
app.use('/css', express.static(__dirname + '/views/css'));


// Webserver initialization

let server = http.Server(app);


// Socket.io initialization

let io = socket(server);


// Socket.io responses

/*
 * Planned Emittable Event types:
 *
 * Message
 * Info (visible for one user only)
 * User Join/Leave
 * Alert (shows a client popup)
 */

io.on('connection', sock => {
    console.log('User connected. SocketID ' + sock.id + ', IP ' + sock.handshake.address);
    sock.emit('message', 'The connection to the websocket was successfully established.');
    
    // Create new User and send it to the client

    sock.user = new chat.User('Gustav', sock);
    cached_users.set(sock.id, sock.user);


    sock.on('message', message => {
        // Send message to other clients

        if(cached_users.has(sock.id) && cached_users.get(sock.id)){
    
            let user = cached_users.get(sock.id);
            if(user.ban != 'none') sock.emit('alert', [
                'You were banned from the chatroom.', 
                'By: ' + user.ban.executor.name + '\nReason: ' + user.ban.reason
            ]);
            else {
                let msg = new chat.Message(message.content, user, message.channel);
                io.emit('message', msg);
            }
        }
    });
});


// Express response for main page

require('./routes.js')(app);


// listen

server.listen(config.port, () => {
    console.log('Webserver listening on port ' + config.port);
});
