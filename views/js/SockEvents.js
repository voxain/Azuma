
   
    let chat_channel = 'none';

    var socket = io();

    let last = {
        author: '',
        id: ''
    };

    socket.emit('login', window.localStorage.getItem('token'));

let missed = 0;
$(window).on('focus', () => {
    missed = 0;
    document.title = `Azuma`;
    $('#message').focus();
});

let sounds = {
    newMessage: new Audio('/resources/audio/message.mp3')
};
socket.on('message', msg => {
    if(!document.hasFocus() || chat_channel != msg.channel){
        sounds.newMessage.play();
        missed += 1;
        document.title = `(${missed}) Azuma`;
        create_alert(`${msg.author.name} #${msg.channel}`, msg.content, 'chat');
    }
    /*if(chat_channel == msg.channel)*/ create_message(msg);

    // Scroll down so the user can see the new message
    document.getElementById('scroller').scrollTo(0,document.getElementById('scroller').scrollHeight);
});

// TODO
// Receive an event for a new joined user and create an entry in the user list.


socket.on('alert', al => {
    create_alert(al[0], al[1]);
});

socket.on('system', al => {
    create_banner(al);
    //create_alert('System', al, 'info');
});

socket.on('typing', data => {
    if(data.state){
        let typer = document.createElement('span');
        typer.innerHTML = safe_text(data.data.name + ' ');
        typer.id = 'typing-' + data.data.id;

        $('#typing').append(typer);
        $('#typing').css('bottom', '70px');
    }
    else{
        $('#typing-' + data.data.id).remove();
        if(document.getElementById('typing').innerHTML == '<b>Typing: </b>') $('#typing').css('bottom', '40px');
    }
});

socket.on('user_change', data => {
    if(data.action == 'new') create_user(data.data);
});


socket.on('disconnect', () => {
    // TODO
    // On socket disconnect try to reconnect with the token as message
    // The server will recognize the token and re-login the user

    $('#disconnection-warning').addClass('unhide');
})

socket.on('connect', () => {
    $('#disconnection-warning').removeClass('unhide');
})