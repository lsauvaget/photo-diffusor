const fs = require('fs');
const bluebird = require('bluebird');
bluebird.promisifyAll(fs);

module.exports = Slideshow;

const unimplementedMethod = (name) => {
    return () => {
        throw new Error(`Not Implemented Method ${name}`);
    }
}

function Slideshow(adapter = {}) {
    const getImages = adapter.getImages || unimplementedMethod('getImages');

    let _state = {};

    function init() {
        return getImgs()
            .then(state => {
                _state = state;
            });
    }

    function getImgs() {
        return getImages()
            .then(files => {
                files[0].current = true;
                return files;
            });
    }

    function getState() {
        return _state;
    }

    function nextFrame() {
        let cursorPos = _state.findIndex(e => e.current);
        let nextCursorPos = cursorPos < _state.length - 1  ? cursorPos + 1 : 0;
        _state[cursorPos].current = false;
        _state[nextCursorPos].current = true;
    }

    function prevFrame() {
        let cursorPos = _state.findIndex(e => e.current);
        let prevCursorPos = cursorPos - 1 < 0 ? _state.length-1 : cursorPos - 1;
        _state[cursorPos].current = false;
        _state[prevCursorPos].current = true;
    }

    return {
        init,
        getImgs,
        nextFrame,
        prevFrame,
        getState
    }
}
