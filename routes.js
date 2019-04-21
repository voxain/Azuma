let cached_users= require('./cache_users.js');
const chat      = require('./classes.js');


module.exports = app => {
    app.get('/', (req, res) => {
        res.render('home');
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


    // API Requests
    
    app.get('/api/create_user/:username', (req, res) => {
        // TODO: Save user into database.
        // Oh and, make a database.

        let acc = new chat.User(req.params.username, 'none');
        cached_users.set(acc.token, acc);
        res.send({success:true, token: acc.token});
    });  
    app.get('/api/create_user/', (req, res) => {
        res.send({success:false, error: 'You have to enter a username.'});
    });  

    app.get('/api/user/token/:token', (req, res) => {
        if(cached_users.has(req.params.token)){
            res.send(JSON.stringify({success: true, data: cached_users.get(req.params.token)}));
        }
        else res.send({success: false, message: 'Could not find user with this token.'});
    });
};