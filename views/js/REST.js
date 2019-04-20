let api = {
    request(endpoint) {
        let request = new XMLHttpRequest();
        request.open('GET', '/api/' + endpoint);

        request.onload = () => {
            return request.response;
        };
        request.onerror = err => {
            console.error(err);
        };
        request.send();
    }
};