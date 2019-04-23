// Package requirements

const express   = require('express');
const hbs       = require('express-handlebars');
const http      = require('http');
const socket    = require('socket.io');

const chat      = require('./classes.js');
const config    = require('./server-config.json');
const randoms   = {
    names   : require('./defaults/randomNames.js'),
    joins   : require('./defaults/joinMessages.js'),
    leaves  : require('./defaults/leaveMessages.js')
};


// Caches Setup

let cached_users = require('./cache_users.js');
cached_users.set(config.adminToken, new chat.User('admin', 'admin', [['color', 'red'], ['verified', 'true'], ['token', config.adminToken]]));


// Express initialization

let app = express();

app.engine('handlebars', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/resources', express.static(__dirname + '/views/resources'));
app.use('/css', express.static(__dirname + '/views/css'));
app.use('/js', express.static(__dirname + '/views/js'));


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

    sock.on('login', data => {
        if(cached_users.has(data)){
            sock.user = cached_users.get(data);
    
            sock.emit('system', '<b>Welcome to the chat!</b><br>The server time is ' + new Date() + '.<br><del>Use <b>/help</b> in chat to see a list of chat commands.</del>');
            io.emit('system', randoms.joins[Math.round(Math.random() * (randoms.joins.length - 1))].replace(/%username%/g, `<b>${sock.user.name}</b>`));
        }
        else io.emit('alert', ['Your login failed.', 'That\'s all we know.']);
    });


    sock.on('disconnect', () => {
        if(sock.user && cached_users.has(sock.user.token)) io.emit('system', randoms.leaves[Math.round(Math.random() * (randoms.leaves.length - 1))].replace(/%username%/g, `<b>${sock.user.name}</b>`));
    });

    sock.on('message', message => {

        if(sock.user && cached_users.has(sock.user.token) && cached_users.get(sock.user.token)){
    
            let user = cached_users.get(sock.user.token);
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
                let safeUser = Object.assign({}, sock.user);
        
                delete safeUser.token;
                delete safeUser.lastSocket;
                delete safeUser.signUpAddress;
                let msg = new chat.Message(message.content, safeUser, message.channel);

                // Preparation for chat commands
                /*
                 * Implemented Commands:
                 * /system <message>: Sends a join/leave-like message banner
                 * /color <user> <color>: Applies the given color to the given user.
                 *
                 * Planned commands:
                 * /eval <code>: Evals JavaScript code from the chat
                 * /ban <user> <reason>: Bans the given user for the given reason.
                 * 
                 */
                if(msg.content.startsWith('/')) {
                    let invoke = msg.content.substr(1).split(' ')[0];
                    let args = msg.content.substr(1).split(' ');
                    args.shift()
                    switch(invoke){
                        case('system'): 
                            if(user.perms.announce || user.perms.admin) io.emit('system', msg.content.replace('/system ', ''));
                            else sock.emit('system', 'To do that, you need to be an <b>admin</b> or <b>announcer</b>.');
                            break;
                        case('color'): 
                            if(user.perms.channels || user.perms.admin){
                                cached_users.filter(u => u.name == args[0]).prop('color', args[1]);
                                sock.emit('system', `${args[0]} now has the color <span style="color: ${args[1]}">${args[1]}</span>`);
                            }
                            else sock.emit('system', 'To do that, you need to be an <b>admin</b> or <b>channel manager</b>.');
                            break;
                    }
                }

                else io.emit('message', msg);
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
