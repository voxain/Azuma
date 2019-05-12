let getToken = () => {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWQYZ123456789'.split('');
    let token = '';
    for (let i = 0; i < 32; i++){
        if(Math.round(Math.random())) token += chars[Math.round( Math.random() * (chars.length - 1) )].toLowerCase();
        else token += chars[Math.round( Math.random() * (chars.length) - 1 )];
    }
    return token;
};

class User{
    constructor(nickname, perms, props, socket){
        this.id = Date.now() * Math.round( Math.random() * 5 ) + 1;
        this.name = nickname;

        this.verified = false;
        this.avatar = '/resources/graphics/avatars/azuma-3.svg';
        this.color = '#666';
        this.status = 'online';
        this.banned = 'none';

        this.perms = new UserPermissions(perms || '');

        this.token = getToken();

        this.lastSocket = (socket ? socket.id : 'none');
        this.signUpAddress = (socket ? socket.handshake.address : 'none');

        this.createdAt = Date.now();

        if(props && props != 'none'){
            props.map(k => {
                this[k[0]] = k[1];
            });
        }
    }
    ban(reason, executor){
        this.banned = new Ban(reason, executor);
    }
    prop(property, value){
        this[property] = value;
    }
    safeUser(){
        let us = Object.assign({}, this);

        delete us.token;
        delete us.lastSocket;
        delete us.signUpAddress;

        return us;
    }
}

class Channel{
    constructor(name, type){
        this.id = Date.now() * Math.round( Math.random() * 5 ) + 1;
        this.name = name;

        this.type = type || 'text';
        this.messages = []; // Preparation for persistent messages, going to introduce a db later.

        this.createdAt = Date.now();
    }
}

class Message{
    constructor(content, author, channel){
        this.id = Date.now() * Math.round( Math.random() * 5 ) + 1;
        this.content = content;
        this.author = author;
        this.channel = channel;

        // Preparation for making banners
        // if(author == 'system') this.type == 'system';
        // else this.type = 'message';

        this.createdAt = Date.now();
    }
}

class Ban{
    constructor(reason, author){
        this.status = true;
        this.reason = reason;
        this.executor = author;

        this.expiring = 'never';
        this.createdAt = Date.now();
    }
}

class UserPermissions{
    constructor(perms){
        this.ban = false;
        this.channels = false;
        this.announce = false;
        this.admin = false;

        switch(perms){
            case('admin'): 
                this.admin = true;
                break;
            case('moderator'): 
                this.ban = true;
                this.channels = true;
                break;
            case('announcer'): 
                this.announce = true;
                break;
        }
    }

}


module.exports = {
    Message, User, Channel
};