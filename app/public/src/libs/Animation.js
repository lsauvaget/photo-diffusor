function Animate() {
    function animate(fn, timeout) {
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

module.exports = Animate;
