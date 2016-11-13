const AbstractSocketEvent = require('./AbstractSocketEvent.js');
const slideshow = require('../../lib/slideshow');

class SocketPrevNext extends AbstractSocketEvent{
  constructor(socket, io) {
    super(socket, io)
  }

  attachEvents(io, socket) {
    socket.on('next', () => {
      slideshow.nextFrame();
      io.emit('load', slideshow.getState());
    });

    socket.on('prev', () => {
      slideshow.prevFrame();
      io.emit('load', slideshow.getState());
    });
  }
}

module.exports = SocketPrevNext;
