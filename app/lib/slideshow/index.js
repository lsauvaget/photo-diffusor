const imagesPath = require('../../config.js').public.images.absPath;
const publicImagePath = require('../../config.js').public.images.publicPath;
const {imageSource} = require('../../config.js');
const Slideshow = require('./Slideshow.js');

const adapters = {
    flickr: require('./FlickrAdapter.js')(imagesPath, publicImagePath),
    fileSystem: require('./FilesystemAdapter.js')()
}


module.exports = new Slideshow(adapters[imageSource]);
