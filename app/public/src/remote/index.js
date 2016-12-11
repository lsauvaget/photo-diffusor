const {button, div} = require('../libs/Dom.js');
const socket = io();

function next(){
  socket.emit('next');
}

function prev(){
  socket.emit('prev');
}

module.exports = div({className: 'remote'}, 
    button({className: 'remote__button', textContent: 'prev', onclick: prev}),
    button({className: 'remote__button', textContent: 'next', onclick: next}),
);
