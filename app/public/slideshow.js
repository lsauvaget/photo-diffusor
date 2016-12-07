const ImageLoader = (() => {
    const imageLoader = {
        init(canvas, options = {}){
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            this._options = Object.assign({}, this._defaultOptions, options);
            return this;
        },

        _easingEffects: {
            easeInOutCubic(t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            }
        },

        _defaultOptions: {
            easing: 'easeInOutCubic',
            imageSize: 'contain',
            duration: 5000
        },

        _easingEffect(t, b, c, d) {
            const easing = this._options.easing;
            const fn = typeof easing === 'function' ?  easing : this._easingEffects[easing];
            return fn.call(this, t, b, c, d)
        },

        _computeMaxHeightAndMaxWidth(width, height, containerWidth, containerHeight) {
            const imageSize = this._options.imageSize;
            const fn =  typeof imageSize === 'function' ?  imageSize : this._computerImageSize[imageSize];
            return fn.call(this, width, height, containerWidth, containerHeight);
        },

        _computerImageSize: {
            contain(width, height, containerWidth, containerHeight){
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
            cover(width, height, containerWidth, containerHeight){
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
        },

        _animate(fn, timeout) {
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
        },


        loadImage(url) {
            const img = new Image();
            img.src = url;
            img.onload = this._draw.bind(this, img);
            return img;
        },

        _draw(img) {
            const {width, height} = img;
            const {maxWidth, maxHeight} = this._computeMaxHeightAndMaxWidth(width, height, this.canvas.width, this.canvas.height);

            this._animate((timer, duration) => {
                const scale = this._easingEffect(timer, 1, 0.05, duration/ 2);
                this.context.clearRect(0, 0, width, height);
                this.context.fillStyle = '#212121';
                this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
                const marginLeft = (this.canvas.width - maxWidth * scale) / 2;
                const marginRight = (this.canvas.height - maxHeight * scale) / 2;
                this.context.drawImage(img, marginLeft , marginRight, maxWidth * scale, maxHeight * scale);
            }, this._options.duration);
        }
    };

    return (canvas, options) => {
        return Object.create(imageLoader).init(canvas, options);
    };
})();


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
