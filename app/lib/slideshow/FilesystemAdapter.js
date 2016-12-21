const fs = require('fs');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

module.exports = (options) => {
    function getImages() {
        return Promise.resolve()
            .then(() => fs.readdirAsync(options.imagesPath))
            .then(files => {
                return files
                    .filter(e => /\.jpg$/.test(e))
                    .map(e => ({url: `${options.publicImagePath}/${encodeURI(e)}`}))
            });
    }
    return {getImages};
}
