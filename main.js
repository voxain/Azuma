// Package requirements

const express   = require('express');
const hbs       = require('express-handlebars');
const http      = require('http');
const socket    = require('socket.io');

const chat      = require('./classes.js');


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

io.on('connection', sock => {
    console.log('User connected. SocketID ' + sock.id + ', IP ' + sock.handshake.address);
    sock.emit('message', 'The connection to the websocket was successfully established.');
    // Create new User and send it to the client

    sock.on('message', content => {
        // Send message to other clients
    });
});


// Express response for main page

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/chat', (req, res) => {
    res.render('home', {
        layout: 'chat'
    });
});


// listen

server.listen(80, () => {
    console.log('Webserver listening on port 80.');
});
