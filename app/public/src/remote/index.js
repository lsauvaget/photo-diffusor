const {button, div, img} = require('../libs/Dom.js');
const socket = io();

function next(){
  socket.emit('next');
}

function prev(){
  socket.emit('prev');
}

const wrapper = (...wrapped) => div({className: 'remote'}, ...wrapped)

const buttons = div({className: 'remote__buttons'},
    button({className: 'remote__buttons__prev', textContent: '<', onclick: prev}),
    button({className: 'remote__buttons__next', textContent: '>', onclick: next}),
);


const gallery = div({className: 'remote__gallery'});

const images = imgs => div({className: 'remote__gallery__items'},
    ...imgs.map(obj => {
        return (
            img({className: 'remote__gallery__items__item', src: obj.thumbnail})
        )
    })
);

socket.on('init', (imgs) => {
    gallery.appendChild(images(imgs));
});

socket.on('load', (imgs) => {
    const current = imgs.findIndex(image => image.current);
    [...gallery.childNodes[0].childNodes].forEach((e,i) => {
        if(~e.classList.contains('current')){
            e.classList.toggle('remote__gallery__items__item--current');
        }
        if(i === current) {
            e.classList.toggle('remote__gallery__items__item--current');
        }
    })
});

module.exports = wrapper(buttons, gallery);
