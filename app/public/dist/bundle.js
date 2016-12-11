/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const root = document.querySelector('#root');
	
	window.onload = () => {
	    switch (location.pathname) {
	        case '/slideshow':
	            root.appendChild(__webpack_require__(1));
	            break;
	        default:
	            root.appendChild(__webpack_require__(7));
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const socket = io();
	const ImageLoader = __webpack_require__(2);
	const { div, canvas } = __webpack_require__(6);
	
	const wrapper = canvas => div({ className: 'slideshow' }, canvas);
	
	const canvasForDisplaySlideshow = canvas({
	  className: 'slideshow__canvas',
	  width: window.innerWidth,
	  height: window.innerHeight
	});
	
	module.exports = wrapper(canvasForDisplaySlideshow);
	
	const imageLoader = ImageLoader(canvasForDisplaySlideshow, { imageSize: 'cover' });
	
	function next() {
	  socket.emit('next');
	}
	
	function prev() {
	  socket.emit('prev');
	}
	
	document.onkeydown = evt => {
	  if (evt.keyCode === 37) {
	    prev();
	  }
	  if (evt.keyCode === 39) {
	    next();
	  }
	};
	
	socket.on('init', images => {
	  const current = images.findIndex(image => image.current);
	  imageLoader.loadImage(`${ images[current].url }`);
	});
	
	socket.on('load', images => {
	  const current = images.findIndex(image => image.current);
	  imageLoader.loadImage(`${ images[current].url }`);
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const ComputeImageSize = __webpack_require__(3);
	const Easing = __webpack_require__(4);
	const Animate = __webpack_require__(5);
	
	function ImageLoader(canvas, options = {}) {
	    const context = canvas.getContext('2d');
	    const _options = Object.assign({
	        duration: 5000
	    }, options);
	
	    const { easingEffect } = Easing(_options);
	    const { computeMaxHeightAndMaxWidth } = ComputeImageSize(_options);
	    const { animate } = Animate(_options);
	
	    function _drawImage(img) {
	        return evt => {
	            const { width, height } = img;
	            const { maxWidth, maxHeight } = computeMaxHeightAndMaxWidth(width, height, canvas.width, canvas.height);
	            animate((timer, duration) => {
	                const scale = easingEffect(timer, 1, 0.05, duration / 2);
	                context.clearRect(0, 0, width, height);
	                context.fillStyle = '#212121';
	                context.fillRect(0, 0, canvas.width, canvas.height);
	                const marginLeft = (canvas.width - maxWidth) / 2;
	                const marginRight = (canvas.height - maxHeight * scale) / 2;
	                context.drawImage(img, marginLeft, marginRight, maxWidth * scale, maxHeight * scale);
	            }, _options.duration);
	        };
	    }
	
	    function loadImage(url) {
	        const img = new Image();
	        img.src = url;
	        img.onload = _drawImage(img);
	        return img;
	    }
	
	    return { loadImage };
	}
	
	module.exports = ImageLoader;

/***/ },
/* 3 */
/***/ function(module, exports) {

	function ComputeImageSize(options) {
	    const _options = Object.assign({
	        imageSizeMode: 'contain'
	    }, options);
	
	    function computeMaxHeightAndMaxWidth(width, height, containerWidth, containerHeight) {
	        const imageSizeMode = _options.imageSize;
	        const fn = typeof imageSizeMode === 'function' ? imageSizeMode : _computerImageSize[imageSizeMode];
	        return fn(width, height, containerWidth, containerHeight);
	    }
	
	    const _computerImageSize = {
	        contain(width, height, containerWidth, containerHeight) {
	            const ratio = width / height;
	            const landscapeOrientation = ratio > 0;
	            if (landscapeOrientation) {
	                const computedMaxHeight = containerWidth / ratio;
	                const computedMaxWidth = containerWidth;
	                const delta = containerHeight - computedMaxHeight;
	                if (delta < 0) {
	                    const finalHeight = computedMaxHeight + delta;
	                    const finalWidth = finalHeight * ratio;
	                    return {
	                        maxWidth: finalWidth,
	                        maxHeight: finalHeight
	                    };
	                }
	                return {
	                    maxWidth: computedMaxWidth,
	                    maxHeight: computedMaxHeight
	                };
	            } else {
	                const computedMaxHeight = containerHeight;
	                const computedMaxWidth = computedMaxHeight * ratio;
	                const delta = containerWidth - computedMaxWidth;
	                if (delta < 0) {
	                    const finalWidth = computedMaxWidth + delta;
	                    const finalHeight = finalHeight / ratio;
	                    return {
	                        maxWidth: finalWidth,
	                        maxHeight: finalHeight
	                    };
	                }
	                return {
	                    maxWidth: computedMaxWidth,
	                    maxHeight: computedMaxHeight
	                };
	            }
	        },
	        cover(width, height, containerWidth, containerHeight) {
	            const ratio = width / height;
	            if (ratio > 1) {
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
	    };
	    return { computeMaxHeightAndMaxWidth };
	}
	
	module.exports = ComputeImageSize;

/***/ },
/* 4 */
/***/ function(module, exports) {

	function Easing(options = {}) {
	    const _options = Object.assign({
	        easing: 'easeInOutCubic'
	    }, options);
	
	    const _easingEffects = {
	        easeInOutCubic(t, b, c, d) {
	            return c * Math.sin(t / d * (Math.PI / 2)) + b;
	        }
	    };
	
	    function easingEffect(t, b, c, d) {
	        const easing = _options.easing;
	        const fn = typeof easing === 'function' ? easing : _easingEffects[easing];
	        return fn(t, b, c, d);
	    }
	
	    return { easingEffect };
	}
	
	module.exports = Easing;

/***/ },
/* 5 */
/***/ function(module, exports) {

	function Animate() {
	    function animate(fn, timeout) {
	        return new Promise((resolve, reject) => {
	            let start = null;
	            function f(timestamp) {
	                if (!start) {
	                    start = timestamp;
	                }
	                let progress = Math.round(timestamp - start);
	                if (progress < timeout) {
	                    fn(progress, timeout);
	                    window.requestAnimationFrame(f);
	                } else {
	                    resolve();
	                }
	            }
	            window.requestAnimationFrame(f);
	        });
	    }
	    return { animate };
	};
	
	module.exports = Animate;

/***/ },
/* 6 */
/***/ function(module, exports) {

	function deepAssign(dst, source) {
	  const keys = Object.keys(source);
	  keys.forEach(key => {
	    if (typeof dst[key] === 'object' && typeof source[key] === 'object') {
	      deepAssign(dst[key], source[key]);
	      return;
	    }
	    if (typeof source[key] === 'object') {
	      dst[key] = source[key].map ? [] : {};
	      deepAssign(dst[key], source[key]);
	      return;
	    }
	    dst[key] = source[key];
	  });
	  return dst;
	}
	
	function h(type, attrs = {}, ...childs) {
	  var elm = document.createElement(type);
	  deepAssign(elm, attrs);
	  childs.forEach(function (child) {
	    elm.appendChild(child);
	  });
	  return elm;
	}
	
	const dom = ['H1', 'H2', 'H3', 'P', 'LABEL', 'IMG', 'INPUT', 'DIV', 'SPAN', 'HR', 'BUTTON', 'CANVAS'].reduce((acc, type) => {
	  acc[type.toLowerCase()] = (...args) => h(type, ...args);
	  return acc;
	}, {});
	
	module.exports = dom;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const { button, div } = __webpack_require__(6);
	const socket = io();
	
	function next() {
	  socket.emit('next');
	}
	
	function prev() {
	  socket.emit('prev');
	}
	
	module.exports = div({ className: 'remote' }, button({ className: 'remote__button', textContent: 'prev', onclick: prev }), button({ className: 'remote__button', textContent: 'next', onclick: next }));

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map