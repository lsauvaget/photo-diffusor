const AbstractSocketEvent = require('./AbstractSocketEvent.js');
const slideshow = require('../../lib/slideshow');


class SocketInit extends AbstractSocketEvent{
  constructor(socket, io) {
    super(socket, io)
  }

  attachEvents(io, socket) {
    socket.emit('init', slideshow.getState())
  }
}

module.exports = SocketInit;
