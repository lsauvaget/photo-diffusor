const adapterInterface = require('./Adapter.js');
const fs = require('fs.extra');
const Promise = require('bluebird');
const sharp = require('sharp');

Promise.promisifyAll(fs);


function readImageFiles(imagesPath) {
    return fs.readdirAsync(imagesPath) 
        .then(files => {
            return files.filter(e => /\.jpg$/.test(e));
        })
}

function removeThenCreateFolder(thumbnailFile) {
    try{
        fs.rmrfSync(thumbnailFile);
    }catch(err){}
    fs.mkdirSync(thumbnailFile);
}

function resizeThenRecordImageFile(sourceImagePath, destImagePath) {
    return (imageName) => {
        new Promise((resolve, reject) => {
            sharp(`${sourceImagePath}/${imageName}`)
                .resize(400, 400)
                .crop(sharp.strategy.attention)
                .toFile(`${destImagePath}/${imageName}`, err => {
                    err ? reject(`${err} : ${sourceImagePath}/${imageName}`) : resolve(imageName);
                });
        });
    };
}


const fileSystemAdapter = Object.assign(Object.create(adapterInterface), {
    init(options) {
        this.options = options;
        this.thumbnailFile = `${options.imagesPath}/thumbnail`;
    },

    getImages() {
        return readImageFiles(this.options.imagesPath)
            .then(images => {
                removeThenCreateFolder(this.thumbnailFile);
                const thumbnail = resizeThenRecordImageFile(this.options.imagesPath,this.thumbnailFile);
                return Promise.all(images.map(thumbnail));
            })
            .then(images => {
                return images.map(image => ({
                    name: image,
                    fullSize: `${this.options.publicImagePath}/${encodeURI(image)}`,
                    thumbnail:`${this.options.publicImagePath}/thumbnail/${encodeURI(image)}` 
                }))
            })
            .catch(error => {
                console.log(error);
            });
    }
})

module.exports = (options) => {
    const _fileSystemAdapter = Object.create(fileSystemAdapter);
    _fileSystemAdapter.init(options);
    return _fileSystemAdapter;
}
