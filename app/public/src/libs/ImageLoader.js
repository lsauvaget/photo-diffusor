const ComputeImageSize = require('./ComputeImageSize.js');
const Easing = require('./Easing.js');
const Animate = require('./Animation.js');

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
        img.onload = _drawImage(img);
        return img;
    }

    return {loadImage};
}

module.exports = ImageLoader;
