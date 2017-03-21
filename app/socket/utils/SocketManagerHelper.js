const socketManagers = require('../managers');
const middlewares = require('./SocketMiddlewaresFactory.js')();

//middlewares.add((socket, io, next) => {
    //console.log('message');
    //next();
//});

function SocketManagerHelper(io, socket) {
    //middlewares.exec(socket, io);
    Object.keys(socketManagers).forEach((key) => {
      new socketManagers[key](socket, io);
    });
}

module.exports = SocketManagerHelper;
