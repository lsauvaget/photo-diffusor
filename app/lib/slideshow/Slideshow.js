const fs = require('fs');
const bluebird = require('bluebird');
bluebird.promisifyAll(fs);

class Slideshow {
  constructor(imagesPath, publicImagePath) {
    this.imagesPath = imagesPath;
    this.publicImagePath = publicImagePath;
    this.state = [];
  }

  init() {
    this.getImgs()
    .then(state => {
      this.state = state;
    });
  }

  getImgs() {
    return Promise.resolve()
    .then(() => fs.readdirAsync(this.imagesPath))
    .then(files => {
      return files
      .filter(e => /\.jpg$/.test(e))
      .map(e => ({url: `${this.publicImagePath}/${encodeURI(e)}`}))
      .reduce((acc, e, i) => {
        return i !== 0 ? acc.concat(e) : acc.concat(Object.assign({}, e, {current: true}));
      }, []);
    })
  }

  getState() {
    return this.state;
  }

  nextFrame() {
    let cursorPos = this.state.findIndex(e => e.current);
    let nextCursorPos = cursorPos < this.state.length - 1  ? cursorPos + 1 : 0;
    this.state[cursorPos].current = false;
    this.state[nextCursorPos].current = true;
  }

  prevFrame() {
    let cursorPos = this.state.findIndex(e => e.current);
    let prevCursorPos = cursorPos - 1 < 0 ? this.state.length-1 : cursorPos - 1;
    this.state[cursorPos].current = false;
    this.state[prevCursorPos].current = true;
  }
}

module.exports = Slideshow;
