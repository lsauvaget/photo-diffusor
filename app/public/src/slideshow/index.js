const socket = io();
const ImageLoader = require('../libs/ImageLoader.js');
const {div, canvas} = require('../libs/Dom.js');

const wrapper = canvas => div({className: 'slideshow'}, canvas) 

const canvasForDisplaySlideshow = canvas({
    className:'slideshow__canvas',
    width: window.innerWidth,
    height: window.innerHeight
});

module.exports = wrapper(canvasForDisplaySlideshow);


const imageLoader  = ImageLoader(canvasForDisplaySlideshow, {imageSize: 'cover'});


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
    imageLoader.loadImage(`${images[current].url}`);
});

socket.on('load', (images) => {
    const current = images.findIndex(image => image.current);
    imageLoader.loadImage(`${images[current].url}`);
});

