const {socketManager} = require('./utils');

module.exports = {
    create: (server, io) => {
        const instance = io(server);
        instance.on('connection', socketManager.bind(null, instance));
    }
}
