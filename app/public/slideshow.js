const socket = io();

const counter = document.querySelector('#counter');
const img = document.querySelector('#image');

function next(){
  socket.emit('next');
}

function prev(){
  socket.emit('prev');
}

document.onkeydown = (evt) => {
  if(evt.keyCode === 37) {
    prev();
  }
  if(evt.keyCode === 39) {
    next();
  }
}



socket.on('init', (images) => {
  const current = images.findIndex(image => image.current);
  img.style.backgroundImage = `url('${images[current].url}')`;
});

socket.on('load', (images) => {
  const current = images.findIndex(image => image.current);
  img.style.backgroundImage = `url('${images[current].url}')`;
});
