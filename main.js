// Package requirements

const express   = require('express');
const hbs       = require('express-handlebars');
const http      = require('http');
const socket    = require('socket.io');

const chat      = require('./classes.js');
const config    = require('./server-config.json');


// Caches Setup

let cached_users = new Map();

cached_users.set('DEFAULT', require('./defaults/user.js'));


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
 * System (Banner in chat)
 * User Join/Leave
 * Alert (shows a client popup)
 */

io.on('connection', (sock) => {
    console.log('User connected. SocketID ' + sock.id + ', IP ' + sock.handshake.address);

    /*sock.on('login', data => {
        console.log('login')
        if(data.token == 'new'){
            console.log('new user')
            // Create new User and send it to the client

            sock.user = new chat.User(require('./randomNames.js')[Math.round(Math.random() * 6)], 'none', 'none', sock);
            cached_users.set(sock.user.token, sock.user);

            sock.emit('login', cached_users.get(data.token));
        }
        else{
            console.log('relogin')
            if(cached_users.has(data.token)){
                sock.emit('system', 'You have been logged in as ' + cached_users.get(data.token).name);
                sock.emit('login', cached_users.get(data.token));
                sock.user = cached_users.get(data.token);
                cached_users.set(sock.user.token, sock.user);
                io.emit('system', 'User online: <b>' + sock.user.name + '</b>');
            }
        }
    });*/
        sock.user = new chat.User(require('./randomNames.js')[Math.round(Math.random() * 6)], 'none', 'none', sock);
        cached_users.set(sock.id, sock.user);
        io.emit('system', 'New user: <b>' + sock.user.name + '</b>');

    sock.on('disconnect', () => {
        io.emit('system', 'User left: <b>' + sock.user + '</b>');
    });

    sock.on('message', message => {
        // Send message to other clients
        

        if(cached_users.has(sock.id) && cached_users.get(sock.id)){
    
            let user = cached_users.get(sock.id);
            if(user.ban != 'none') sock.emit('alert', [
                'You were banned from the chatroom.', 
                'By: ' + user.ban.executor.name + '\nReason: ' + user.ban.reason
            ]);
            else if(message.content == '' || !message.content.match(/([^ ])/g)) sock.emit('alert', [
                'Your message is too short.', 
                'Please don\'t send empty messages.'
            ]);
            else if(message.content.length > 2000) sock.emit('alert', [
                'Your message is too long.', 
                'Your message must be less than 2000 characters.'
            ]);
            else {
                let msg = new chat.Message(message.content, user, message.channel);
                io.emit('message', msg);
            }
        }
        else{
            sock.emit('alert', ['You\'re not logged in.', 'That\'s all we know.']);
        }
    });

});


// Express response for main page

require('./routes.js')(app);


// listen

server.listen(config.port, () => {
    console.log('Webserver listening on port ' + config.port);
});
