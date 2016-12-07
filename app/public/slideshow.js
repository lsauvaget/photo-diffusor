
function ComputeImageSize(options) {
    const _options = Object.assign({
        imageSizeMode: 'contain'
    }, options);

    function computeMaxHeightAndMaxWidth(width, height, containerWidth, containerHeight) {
        const imageSizeMode = _options.imageSize;
        const fn =  typeof imageSizeMode === 'function' ?  imageSizeMode : _computerImageSize[imageSizeMode];
        return fn(width, height, containerWidth, containerHeight);
    }

    const _computerImageSize = {
        contain(width, height, containerWidth, containerHeight) {
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
        },
        cover(width, height, containerWidth, containerHeight) {
            const ratio = width/height;
            if(ratio > 1) {
                return {
                    maxWidth: containerWidth, 
                    maxHeight: containerWidth / ratio
                };
            }
            return {
                maxWidth: containerHeight, 
                maxHeight: containerHeight * ratio
            };
        }
    }
    return { computeMaxHeightAndMaxWidth }
}

function Easing(options={}) {
    const _options = Object.assign({
        easing: 'easeInOutCubic',
    }, options);

    const _easingEffects = {
        easeInOutCubic(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        }
    };

    function easingEffect(t, b, c, d) {
        const easing = _options.easing;
        const fn = typeof easing === 'function' ?  easing : _easingEffects[easing];
        return fn(t, b, c, d);
    }

    return { easingEffect };
}


function Animate() {
    function animate(fn, timeout) {
        console.log('test')
        return new Promise((resolve, reject) => {
            let start = null;
            function f(timestamp) {
                if(!start) {
                    start = timestamp;
                }
                let progress = Math.round(timestamp - start);
                if( progress < timeout) {
                    fn(progress, timeout);
                    window.requestAnimationFrame(f);
                } else {
                    resolve();
                }
            }
            window.requestAnimationFrame(f);
        });
    }
    return {animate}
};

function ImageLoader(canvas, options={}) {
    const context = canvas.getContext('2d');
    const _options = Object.assign({
        duration: 5000
    }, options);

    const {easingEffect} = Easing(_options);
    const {computeMaxHeightAndMaxWidth} = ComputeImageSize(_options);
    const {animate} = Animate(_options);

    function _drawImage(img) {
        return (evt) => {
            const {width, height} = img;
            const {maxWidth, maxHeight} = computeMaxHeightAndMaxWidth(width, height, canvas.width, canvas.height);
            animate((timer, duration) => {
                const scale = easingEffect(timer, 1, 0.05, duration/ 2);
                context.clearRect(0, 0, width, height);
                context.fillStyle = '#212121';
                context.fillRect(0, 0, canvas.width, canvas.height);
                const marginLeft = (canvas.width - maxWidth) / 2;
                const marginRight = (canvas.height - maxHeight * scale) / 2;
                context.drawImage(img, marginLeft , marginRight, maxWidth * scale, maxHeight * scale);
            }, _options.duration);
        }
    }

    function loadImage(url) {
        const img = new Image();
        img.src = url;
        //img.onload = _drawImage(img);
        img.onload = _drawImage(img);
        return img;
    }

    return {loadImage};
}


const socket = io();

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

socket.on('init', (images) => {
    const current = images.findIndex(image => image.current);
    imageLoader.loadImage(`${images[current].url}`);
});

socket.on('load', (images) => {
    const current = images.findIndex(image => image.current);
    imageLoader.loadImage(`${images[current].url}`);
});
