const Router = require('express').Router();
const absPath = require('../config.js').public.absPath;

Router.get('/', (req, res) => {
  res.sendFile(`${absPath}/index.html`);
});

Router.get('/slideshow', (req, res) => {
  res.sendFile(`${absPath}/slideshow.html`);
});

module.exports = Router;
