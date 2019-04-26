let safe_text = text => {
    let dummy = document.createElement('div');
    dummy.textContent = text;
    return dummy.innerHTML;
};

let create_alert = (title, description, level) => {

    let colors = {
        alert: 'red',
        info: 'blue',
        success: 'green',
        chat: 'blue'
    }

    if(!level) var level = 'alert';
    let notify = document.createElement('div');
    notify.classList = 'alert';

    let icon = document.createElement('div');
    icon.classList = 'alert-left color-' + colors[level];
    switch(level){
        case 'alert':
            icon.innerHTML='<span class="alert-icon mdi mdi-alert-circle-outline"></span>';
            break;
        case 'info':
            icon.innerHTML='<span class="alert-icon mdi mdi-information-outline"></span>';
            break;
        case 'success':
            icon.innerHTML='<span class="alert-icon mdi mdi-check-circle-outline"></span>';
            break;
        case 'chat':
            icon.innerHTML='<span class="alert-icon mdi mdi-message-outline"></span>';
            break;
    }
    notify.append(icon);

    let headline = document.createElement('div');
    headline.classList = 'alert-title';
    headline.innerHTML = title || 'Untitled';
    notify.append(headline);

    let text = document.createElement('div');
    text.classList = 'alert-text';
    text.innerHTML =  description || 'No description';
    notify.append(text);

    let timer = document.createElement('div');
    timer.classList = 'alert-timer';
    notify.append(timer);

    document.body.append(notify);

    setTimeout(() => {                     
        notify.style.animation = 'plopOut .3s cubic-bezier(0.15, 0, 1, -0.5)';
        setTimeout(() => {                     
            document.body.removeChild(notify);
        }, 290);
    }, 3800);
};

let create_message = msg => {
    // Header (Author/Time)
    let header = document.createElement('div');

    let author = document.createElement('span');
    author.classList = 'message-author';
    author.style.color = msg.author.color;
    author.append(document.createTextNode(msg.author.name + ' '));

    let time = document.createElement('span');
    time.classList = 'message-time';
    time.innerHTML = new Date(Date(message.createdAt).toString()).toUTCString();

    header.append(author);
    header.append(time);

    // Content
    let innerText = safe_text(msg.content);

        // URL Validation
        let urls = innerText.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
        if(urls) urls.forEach(u => {
            innerText = innerText.replace(u, `<a href="${u}">${u}</a>`);
        });

    let content = document.createElement('span');
    content.classList = 'message-content';
    content.innerHTML = innerText;


    // Message
    if(last.author.id == msg.author.id){
        document.getElementById('message-' + last.id).append(document.createElement('br'));
        document.getElementById('message-' + last.id).append(content);
    }
    else{
        let message = document.createElement('div');
        message.classList = 'message';
        message.append(header);
        message.append(content);

        message.id = 'message-' + msg.id;
        last.id = msg.id;
        document.getElementById('messages-container').append(message);
    }
    last.author = msg.author;

};

let create_banner = al => {
    let sys = document.createElement('div');
    sys.classList = 'message';
    sys.style.borderLeft = '4px solid #ccc';
    sys.style.borderRadius = '0 10px 10px 0';
    sys.innerHTML = al;

    last.author = '';
    last.id = '';

    document.getElementById('messages-container').append(sys);
    document.getElementById('scroller').scrollTo(0,document.getElementById('scroller').scrollHeight);
}

let channel_list = channels => {
    channels.forEach(c => {
        let channel = document.createElement('div');
        channel.classList = 'channel';
        channel.innerHTML = '#' + c.name;
        channel.id = 'channel-' + c.id;

        $('#channels').append(channel);
    })
};