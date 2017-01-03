const fs = require('fs.extra');
const Promise = require('bluebird');
const sharp = require('sharp');

Promise.promisifyAll(fs);

module.exports = (options) => {
    const thumbnailFile = `${options.imagesPath}/thumbnail`;

    function getImages() {
        return Promise.resolve()
            .then(() => fs.readdirAsync(options.imagesPath))
            .then(files => {
                return files.filter(e => /\.jpg$/.test(e));
            })
        .then(images => {
            try{
                fs.rmrfSync(thumbnailFile);
            }catch(err){}
            fs.mkdirSync(thumbnailFile);
            const promises = images.map((image) => {
                return new Promise((resolve, reject) => {
                    sharp(`${options.imagesPath}/${image}`)
                        .resize(400, 400)
                        .crop(sharp.strategy.attention)
                        .toFile(`${thumbnailFile}/${image}`, err => {
                            err ? reject(`${err} : ${options.imagesPath}/${image}`) : resolve(image);
                        });
                });
            });
            return Promise.all(promises);
        })
        .then(images => {
            return images.map(image => ({
                name: image,
                fullSize: `${options.publicImagePath}/${encodeURI(image)}`,
                thumbnail:`${options.publicImagePath}/thumbnail/${encodeURI(image)}` 
            }))
        })
        .catch(error => {
            console.log(error);
        });
    }
    return {getImages};
}
