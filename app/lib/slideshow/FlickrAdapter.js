const rp = require('request-promise');
const {apiKey} = require('../../config.js').flickr;
const restUri = 'https://api.flickr.com/services/rest';
const qsDefault = { 
    method: 'flickr.photosets.getPhotos',
    api_key,
    photoset_id: '72157656480936626',
    user_id: '43594131@N06',
    extras: 'url_sq, url_t, url_s, url_m, url_o',
    format: 'json',
    nojsoncallback: '1' 
};

module.exports = (options = {}) => {
    const _qs = Object.assign({}, qsDefault, options);
    function getImages() {
        return rp({
            url: restUri,
            qs: _qs,
            json: true
        })
            .then(photosets => {
                console.log(photosets)
                return photosets.photoset.photo.map(photo => {
                    return {
                        url: photo.url_o
                    }
                });
            });
    }
    return {getImages};
};
