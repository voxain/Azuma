
class context_menu{

}

class context_entry{
    constructor(text, icon, action, separator, color){
        this.text = text || 'Information';
        this.icon = icon || 'mdil mdil-information';
        this.action = action;
        this.color = color;
        this.separator = separator || false;
    }
}


let create_context = (type, obj, e) => {
    let menu = document.createElement('div');
    menu.classList = 'context-menu';
    let fields = [];


    switch(type){
        case 'message':
            fields = [
                ['Copy', 'mdil mdil-clipboard', () => copyToClipboard(obj.content), true],
                ['Copy Author ID', 'mdil mdil-content-duplicate', () => copyToClipboard(obj.author.id)],
                ['Copy Message ID', 'mdil mdil-message-text', () => copyToClipboard(obj.id), true],
                ['Show Profile', 'mdil mdil-account', () => create_profile(obj.author)],
                ['Ban Author', 'mdil mdil-logout', () => socket.emit('message', {content: `/ban ${obj.author.id} No reason provided.`, channel: chat_channel}), false, 'red']
            ];
            break;
            case 'channel':
                fields = [
                    ['New...', 'mdil mdil-plus', () => create_alert('Coming soon.', 'Check back later.', 'info'), true],
                    ['Copy ID', 'mdil mdil-content-duplicate', () => copyToClipboard(obj.id)],
                    ['Edit', 'mdil mdil-pencil', () => create_alert('Coming soon.', 'Check back later.', 'info')],
                    ['Delete channel', 'mdil mdil-delete', () => create_alert('Coming soon.', 'Check back later.', 'info'), false, 'red']
                ];
                break;
            case 'user':
                fields = [
                    ['Assign color', 'mdil mdil-view-module', () => create_alert('Coming soon.', 'Check back later.', 'info')],
                    ['Copy ID', 'mdil mdil-content-duplicate', () => copyToClipboard(obj.id), true],
                    ['Ban', 'mdil mdil-logout', () => socket.emit('message', {content: `/ban ${obj.author.id} No reason provided.`, channel: chat_channel}), false, 'red']
                ];
                break;
    }

    fields.forEach(f => {
        let entry = document.createElement('div');
        let icon = document.createElement('span');

        icon.classList = f[1] + ' context-option-icon';
        $(entry).append(icon);

        entry.classList = 'context-option' + (f[3] ? ' separator' : '');
        $(entry).append(document.createTextNode(f[0]));
        $(entry).on('click', e => {
            f[2].call();
        });
        
        entry.style.color = f[4] || '';

        $(menu).append(entry);
    });

    menu.style.height = 40 * fields.length;

    menu.style.left = e.clientX;
    menu.style.top = e.clientY <= window.innerHeight - 40 * fields.length ? e.clientY : e.clientY - 40 * fields.length;

    $(document).on('click', e => {
        $(menu).remove();
    });

    $(document.body).append(menu);
};