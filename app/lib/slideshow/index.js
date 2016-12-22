const config = require('../../config.js');
const Slideshow = require('./Slideshow.js');
const FlickrAdapter = require('./FlickrAdapter.js');
const FilesystemAdapter = require('./FilesystemAdapter.js');

const adapters = {
    flickr: FlickrAdapter({
        api_key: config.flickr.apiKey
    }),
    fileSystem: FilesystemAdapter({
        imagesPath: config.public.images.absPath,
        publicImagePath: config.public.images.publicPath 
    })
}


module.exports = Slideshow(adapters[config.dataSource]);
