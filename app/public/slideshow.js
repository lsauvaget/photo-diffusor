const socket = io();

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


function easeInOutCubic(t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
};


function animation(fn, TIMEOUT) {
    return new Promise((resolve, reject) => {
        let start = null;
        function animate(timestamp) {
            if(!start) {
                start = timestamp;
            }
            let progress = timestamp - start;
            if( progress > TIMEOUT) {
                resolve();
                return false;
            }
            fn(Math.floor(progress), TIMEOUT);
            window.requestAnimationFrame(animate);
        }
        animate();
    });
}

function draw(url) {
    const img = new Image();
    img.src = url;
    img.onload = (e) => {
        const ratio = img.height / img.width;
        if (ratio < 1) {
            animation((timer, duration) => {
                let currWidth = 0;
                let currHeight = 0;

                if (timer < duration / 2) {
                    const scale = easeInOutCubic(timer, 1, 0.05, duration / 2);
                    context.clearRect(0, 0, width, height);
                    currWidth = width * scale;
                    currHeight = ratio * width * scale;
                    context.drawImage(img, 0, 0, currWidth, currHeight);
                } else {
                    const scale = easeInOutCubic(timer, 1, 0.05, duration / 2);
                    if(!scale) {
                        return;
                    }
                    context.clearRect(0, 0, width, height);
                    context.drawImage(img, 0, 0, width * scale, ratio * width * scale);
                }
            }, 5000);
        }else {
            context.drawImage(img, 0, 0, height / ratio, height);
        }
    }
}


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



class Photos {
  constructor(photos = []) {
    this._photos = photos;
    this._cursor = 0;
  }

  static build(photos) {
    return new Photos(photos);
  }

  populate(photos) {
    this._photos = photos;
  }

  getCurrent() {
    return this._photos[this._cursor];
  }

  next() {
    this._cursor = this._cursor < this._photos.length -1 ? this._cursor + 1 : 0;
    return this;
  }

  prev() {
    this._cursor = this._cursor > 0 ? this._cursor - 1 : this._photos.length;
    return this;
  }
}

let photos = Photos.build();

socket.on('init', (images) => {
  photos.populate(images);
  console.log(photos);
});

socket.on('load', (images) => {
  const current = images.findIndex(image => image.current);
  draw(`${images[current].url}`);
  //img.style.backgroundImage = `url('${images[current].url}')`;
});
