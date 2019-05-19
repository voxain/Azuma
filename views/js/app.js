document.addEventListener('contextmenu', e => e.preventDefault());

$(document).ready((localhost) => {
    $('a').attr('target', '_blank');
});

 if(!window.localStorage.getItem('token')){
    create_alert('You need to sign in with an account.', 'You will now be redirected to the login page.', 'alert')
    setTimeout(() => window.location.replace("/login"), 4000);
}

api.request('changelog', ch => {
    ch.forEach((log, i) => {
        if(i < 5){
            $('#changelog').append(log[0]);
            $('#changelog').append(document.createElement('br'));
            $('#changelog').append(log[1]);
            $('#changelog').append(document.createElement('br'));
            $('#changelog').append(document.createElement('br'));
        }
    });
});

let who_am_i = 'nobody';
api.request('user/token/' + window.localStorage.getItem('token'), d => {
    let data = JSON.parse(d);
    if(!data.success){
        create_alert('You provided an invalid token.', 'You will now be redirected to the login page.', 'alert')
        setTimeout(() => window.location.replace("/login"), 4000);
    }
    else{
        $('.header-information').append(document.createTextNode(data.data.name));
        $('#user-online-you-name').append(document.createTextNode(data.data.name));
        $('#user-online-you-name').on('click', e => {
            create_profile(data.data);
        });
        who_am_i = data.data;

        api.request('room/users', userArray => {
            let result = JSON.parse(userArray);

            $('#online-users').text('ONLINE | ' + result.data.length);
            result.data.forEach(acc => {
                create_user(acc)
            });
        });
        

        let channel_dir = new Map();
        api.request('room/channels', c => {
            let data = JSON.parse(c);
            if(!data.success){
                create_alert('Channel list couldn\'t be fetched.', 'Please try reloading the page. ' + data.message, 'alert')
            }
            else{
                channel_list(data.data);
                if(data.data[0][1].messages.length > 0){
                    data.data[0][1].messages.forEach(msg => {
                        create_message(msg);
                    });
                }
            }
        });
    }
});



// TODO
// Focus input on unfocused typing

let send_message = () => {
    // Send message to socket
    socket.emit('message', {
        content: $('#message').val(),
        channel: chat_channel
    });
    $('#message').val('');
};

$('#message').on('keyup', e => {
    if(e.which == 13){
        send_message();
        socket.emit('typing', false);
    }
    else if(!document.getElementById('message').value.length) socket.emit('typing', false);
    else socket.emit('typing', true);
});

$('#send').on('click', e => {
    send_message();
});

$('#theme-switcher').on('change', e => {
        document.getElementById('css-theme').href = `/css/themes/${ $('#theme-switcher').val() }.css`
});

$('#font-switcher').on('change', e => {
    $('body, html, button, input, textarea, select').css('font-family', $('#font-switcher').val());
});


$('.chat-messages').on('click', e => {
    $('.chat-messages').removeClass('darken');
    $('#settings').addClass('hidden');
    $('.settings-popout').removeClass('unhide');
    $('.settings-category').removeClass('color-blue');
});

$('.settings-icon').on('click', e => {
    $('#online').addClass('hidden');
    $('.chat-messages').removeClass('darken');
    $('#settings').toggleClass('hidden');
    $('.settings-popout').removeClass('unhide');
    $('.settings-category').removeClass('color-blue');
});

function settings(name){
    $('.chat-messages').addClass('darken');
    $('.settings-popout').removeClass('unhide');
    $('#settings-' + name + '-popout').addClass('unhide');

    $('.settings-category').removeClass('color-blue');
    $('#settings-' + name).addClass('color-blue');
}



$('.online-icon').on('click', e => {
    $('.chat-messages').removeClass('darken');
    $('.settings-popout').removeClass('unhide');
    $('#settings').addClass('hidden');
    $('#online').toggleClass('hidden');
});