const rp = require('request-promise');
const config = require('../config.js');

const key = config.shortner.key;

module.exports = {
    getShortLink(url) {
        return rp({
            method: 'POST',
            url: 'https://www.googleapis.com/urlshortener/v1/url',
            qs: {
                key: config.shortner.key
            },
            body: {
                longUrl: url
            },
            json: true,
            transform: (raw) => raw.id
        });
    }
};



