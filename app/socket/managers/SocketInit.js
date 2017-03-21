const AbstractSocketEvent = require('./AbstractSocketEvent.js');
const slideshow = require('../../lib/slideshow');
const uuidV4 = require('uuid/v4')


class SocketInit extends AbstractSocketEvent{
  constructor(socket, io) {
    super(socket, io)
  }

  attachEvents(io, socket) {
    const socketId = uuidV4();
    socket.socketId = socketId;
    socket.join(socketId);

    socket.emit('roomId', socketId);
    socket.emit('init', slideshow.getState());

    socket.on('joinRoom', (socketId) => {
        console.log(socketId)
        socket.leave(socket.socketId);
        socket.join(socketId);
        socket.socketId = socketId;
        socket.emit('roomId', socketId);
    });
  }
}

module.exports = SocketInit;
