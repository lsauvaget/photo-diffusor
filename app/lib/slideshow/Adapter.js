
const interface = {
    getImages() {
        throw new Error('getImages is not implemented');
    }
}

module.exports = () => Object.create(interface);
