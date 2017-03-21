const AbstractSocketEvent = require('./AbstractSocketEvent.js');
const slideshow = require('../../lib/slideshow');

class SocketPrevNext extends AbstractSocketEvent{
  constructor(socket, io) {
    super(socket, io)
  }

  attachEvents(io, socket) {
    socket.on('next', () => {
      socket.to(socket.socketId).emit('next');
    });

    socket.on('prev', () => {
      socket.to(socket.socketId).emit('prev');
    });

    socket.on('select', (medium) => {
      socket.to(socket.socketId).emit('select', {selectedMedium: medium});
    });

  }
}

module.exports = SocketPrevNext;
