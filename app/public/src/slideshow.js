const socket = io();
const ImageLoader = require('./libs/ImageLoader.js');

const canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const imageLoader  = ImageLoader(canvas, {imageSize: 'cover'});


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

console.log(socket)

socket.on('init', (images) => {
    const current = images.findIndex(image => image.current);
    imageLoader.loadImage(`${images[current].url}`);
});

socket.on('load', (images) => {
    const current = images.findIndex(image => image.current);
    imageLoader.loadImage(`${images[current].url}`);
});
