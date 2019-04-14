let getToken = () => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWQYZ123456789'.split('');
    let token = '';
    for (let i = 0; i < 32; i++){
        if(Math.round(Math.random())) token += chars[Math.round( Math.random() * (chars.length - 1) )].toLowerCase();
        else token += chars[Math.round( Math.random() * chars.length - 1 )];
    }
    console.log(token)
    return token;
};

class User{
    constructor(nickname, socket){
        this.id = Date.now() * Math.round( Math.random() * 5 );
        this.name = nickname;

        this.token = getToken();

        this.lastSocket = socket.id;
        this.signUpAddress = socket.handshake.address;

        this.createdAt = Date.now();
    }
}

class Message{
    constructor(content, author){
        this.id = Date.now() * Math.round( Math.random() * 5 );
        this.content = content;
        this.author = author;

        this.createdAt = Date.now();
    }
}

module.exports = {
    Message, User
};