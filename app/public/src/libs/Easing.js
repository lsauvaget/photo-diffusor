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

module.exports = Easing;
