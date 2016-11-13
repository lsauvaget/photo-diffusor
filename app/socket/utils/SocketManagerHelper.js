const socketManagers = require('../managers');

class SocketManagerHelper {
  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
    this.init();
  }

  init() {
    Object.keys(socketManagers).forEach((key) => {
      new socketManagers[key](this.socket, this.io);
    });
  }
}

module.exports = SocketManagerHelper;
