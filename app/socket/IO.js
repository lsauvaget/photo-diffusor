const SocketManagerHelper = require('./utils/SocketManagerHelper.js');

class IO {
  constructor(server, io) {
    this.io = io(server);
    this.init();
  }

  static create(server, io) {
    return new IO(server, io);
  }

  init() {
    this.io.on('connection', socket => {
      new SocketManagerHelper(socket, this.io);
    });
  }
}

module.exports = IO;
