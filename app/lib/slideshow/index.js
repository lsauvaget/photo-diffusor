const imagesPath = require('../../config.js').public.images.absPath;
const publicImagePath = require('../../config.js').public.images.publicPath;
const Slideshow = require('./Slideshow.js');

module.exports = new Slideshow(imagesPath, publicImagePath);
