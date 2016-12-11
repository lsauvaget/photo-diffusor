const socket = io();

function next(){
  console.log('next')
  socket.emit('next');
}

function prev(){
  socket.emit('prev');
}
