class AbstractSocketEvent {
  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
    this.attachEvents(io, socket);
  }

  attachEvents(io, socket) {
    throw new Error('method attachEvents not implemented');
  }
}

module.exports = AbstractSocketEvent;
