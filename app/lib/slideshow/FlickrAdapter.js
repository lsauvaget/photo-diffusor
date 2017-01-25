const adapterInterface = require('./Adapter.js');
const rp = require('request-promise');
const restUri = 'https://api.flickr.com/services/rest';
const qsDefault = { 
    method: 'flickr.photosets.getPhotos',
    api_key: '',
    photoset_id: '72157656480936626',
    user_id: '43594131@N06',
    extras: 'url_sq, url_t, url_s, url_m, url_o',
    format: 'json',
    nojsoncallback: '1' 
};

const flickrAdapter = Object.assign(Object.create(adapterInterface), {
    init(options) {
        this. _qs = Object.assign({}, qsDefault, options);
    },
    getImages() {
        return rp({
            url: restUri,
            qs: this._qs,
            json: true
        })
            .then(photosets => {
                console.log(photosets)
                return photosets.photoset.photo.map(photo => {
                    return {
                        fullSize: photo.url_o,
                        thumbnail: photo.url_s,
                        name: photo.title
                    }
                });
            });

    }
});

module.exports = (options = {}) => {
    const _flickrAdapter = Object.create(flickrAdapter);
    _flickrAdapter.init(options);
    return _flickrAdapter;
};
