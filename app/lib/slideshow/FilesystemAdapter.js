const fs = require('fs.extra');
const Promise = require('bluebird');
const sharp = require('sharp');

Promise.promisifyAll(fs);

module.exports = (options) => {
    const thumbnailFile = `${options.imagesPath}/thumbnail`;
    const fullFile = `${options.imagesPath}/full`;

    function getImages() {
        return fs.readdirAsync(options.imagesPath)
            .then(files => {
                return files.filter(e => /\.jpg$/.test(e));
            })
            .then(images => {
                try{
                    fs.rmrfSync(thumbnailFile);
                    fs.rmrfSync(fullFile);
                }catch(err){}
                fs.mkdirSync(thumbnailFile);
                fs.mkdirSync(fullFile);
                return images;
            })
        .then(images => {
            const thumbnailPromises = Promise.all(images.map((image) => {
                return new Promise((resolve, reject) => {
                    sharp(`${options.imagesPath}/${image}`)
                        .resize(600, 400)
                        .crop(sharp.strategy.attention)
                        .jpeg({progressive: true})
                        .toFile(`${thumbnailFile}/${image}`, err => {
                            err ? reject(`${err} : ${options.imagesPath}/${image}`) : resolve(image);
                        });
                });
            }));
            const fullPromise = Promise.all(images.map((image) => {
                return new Promise((resolve, reject) => {
                    sharp(`${options.imagesPath}/${image}`)
                    .resize(1920, 1920)
                    .max()
                    .jpeg({progressive: true})
                    .toFile(`${fullFile}/${image}`, err => {
                            err ? reject(`${err} : ${options.imagesPath}/${image}`) : resolve(image);
                    });
                });
            }));
            return Promise.all([thumbnailPromises, fullPromise]);
        })
        .then(([fulls, thumbnails]) => {
            return fulls.map(image => ({
                name: image,
                fullSize: `${options.publicImagePath}/full/${encodeURI(image)}`,
                thumbnail:`${options.publicImagePath}/thumbnail/${encodeURI(image)}` 
            }))
        })
        .catch(error => {
            console.log(error);
        });
    }
    return {getImages};
}
