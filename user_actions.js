module.exports = {
    safeUser: acc => {
        let us = Object.assign({}, acc);

        delete us.token;
        delete us.lastSocket;
        delete us.signUpAddress;

        return us;
    }
};