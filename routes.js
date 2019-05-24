let cached_users= require('./cache_users.js');
let cached_channels= require('./cache_channels.js');
const chat      = require('./classes.js');


module.exports = app => {
    app.get('/', (req, res) => {
        res.render('home', {
            layout: 'main'
        });
    });
    
    app.get('/chat', (req, res) => {
        res.render('home', {
            layout: 'chat'
        });
    });  
    
    app.get('/login', (req, res) => {
        res.render('home', {
            layout: 'login'
        });
    });  
    
    app.get('/logout', (req, res) => {
        res.render('home', {
            layout: 'logout'
        });
    });  
    
    app.get('/branding', (req, res) => {
        res.render('home', {
            layout: 'branding'
        });
    });  


    // API Requests

    app.get('/api/changelog', (req, res) => {
        res.send(require('./changelogs.json').recent);
    });
    
    app.get('/api/create_user/:username', (req, res) => {
        // TODO: Save user into database.
        // Oh and, make a database.

        let acc = new chat.User(req.params.username, 'none');
        cached_users.set(acc.token, acc);
            

        require('./main.js').emit('user_change', {
            action: 'new',
            data: acc.safeUser()
        });

        res.send({success:true, token: acc.token});
    });  
    app.get('/api/create_user/', (req, res) => {
        res.send({success:false, error: 'You have to enter a username.'});
    });  

    app.get('/api/user/token/:token', (req, res) => {
        if(cached_users.has(req.params.token)){
            res.send(JSON.stringify({success: true, data: cached_users.get(req.params.token)}));
        }
        else res.send(JSON.stringify({success: false, message: 'Could not find a user with this token.'}));
    });

    app.get('/api/user/token/', (req, res) => {
        res.send(JSON.stringify({success: false, message: 'You need to provide a token.'}));
    });

    app.get('/api/room/channels', (req, res) => {
        let channels = cached_channels.get_cache();
        res.send(JSON.stringify({success: true, data: Array.from(channels)}));
    });

    app.get('/api/room/users', (req, res) => {
        let safeDir = [];
        cached_users.get_cache().forEach(u => {
            
            let us = Object.assign({}, u);

            delete us.token;
            delete us.lastSocket;
            delete us.signUpAddress;

            if(u.banned == 'none')safeDir.push(u);
        });

        res.send(JSON.stringify({success: true, data: safeDir}));
    });
};