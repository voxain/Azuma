module.exports = app => {
    app.get('/', (req, res) => {
        res.render('home');
    });
    
    app.get('/chat', (req, res) => {
        res.render('home', {
            layout: 'chat'
        });
    });  
    
    app.get('/logout', (req, res) => {
        res.render('home', {
            layout: 'logout'
        });
    });  
};