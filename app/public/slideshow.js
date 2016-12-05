const socket = io();

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


function easeInOutCubic(t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
};


function animation(fn, timeout) {
    return new Promise((resolve, reject) => {
        let start = null;
        function animate(timestamp) {
            if(!start) {
                start = timestamp;
            }
            let progress = Math.round(timestamp - start);
            if( progress < timeout) {
                fn(progress, timeout);
                window.requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }
        window.requestAnimationFrame(animate);
    });
}

function computeMaxBoundsWidthAndHeight(width, height, containerWidth, containerHeight) {
    const ratio = width/height;
    const landscapeOrientation = ratio > 0;
    if(landscapeOrientation) {
        const computedMaxHeight = containerWidth / ratio;
        const computedMaxWidth = containerWidth;
        const delta = containerHeight - computedMaxHeight;
        if(delta < 0) {
            const finalHeight = computedMaxHeight + delta;
            const finalWidth = finalHeight * ratio;
            return {
                maxWidth: finalWidth,
                maxHeight: finalHeight 
            }
        }
        return {
            maxWidth: computedMaxWidth,
            maxHeight: computedMaxHeight
        }
    }else  {
        const computedMaxHeight = containerHeight;
        const computedMaxWidth = computedMaxHeight * ratio;
        const delta = containerWidth - computedMaxWidth;
        if(delta < 0) {
            const finalWidth = computedMaxWidth + delta;
            const finalHeight = finalHeight / ratio;
            return {
                maxWidth: finalWidth,
                maxHeight: finalHeight 
            }
        }
        return {
            maxWidth: computedMaxWidth,
            maxHeight: computedMaxHeight
        }
    }
}

function animateAfterImageLoad(img) {
    return (event) => {
        const {width, height} = img;
        const {maxWidth, maxHeight} = computeMaxBoundsWidthAndHeight(width, height, window.innerWidth, window.innerHeight);

        animation((timer, duration) => {
            const scale = easeInOutCubic(timer, 1, 0.05, duration / 2);
            context.clearRect(0, 0, width, height);
            context.fillStyle = '#212121';
            context.fillRect(0, 0, window.innerWidth, window.innerHeight);
            context.drawImage(img, (window.innerWidth - maxWidth * scale) / 2, (window.innerHeight - maxHeight * scale) / 2, maxWidth * scale, maxHeight * scale);
        }, 5000);
    }
}

function draw(url) {
    const img = new Image();
    img.src = url;
    img.onload = animateAfterImageLoad(img);
}


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
  draw(`${images[current].url}`);
});

socket.on('load', (images) => {
  const current = images.findIndex(image => image.current);
  draw(`${images[current].url}`);
});
