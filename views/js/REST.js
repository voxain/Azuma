let api = {
    request: (endpoint, callback) => {
        /*let request = new XMLHttpRequest();
        request.open('GET', '/api/' + endpoint);
console.log("new req")
        request.onloaded = () => {
            console.log("new req loaded")
            let data = request.response;
            console.log(data);
            callback(data);
            return data;
        };
        request.onerror = err => {
            console.log(err)
            return err;
        };
        request.send();*/
        $.get('/api/' + endpoint, data => {
            callback(data);
        });    
    }
};