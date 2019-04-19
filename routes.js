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
        res.send({success:true, token: 'ayylmao'});
    });  
    app.get('/api/create_user/', (req, res) => {
        res.send({success:false, error: 'You have to enter a username.'});
    });  
};