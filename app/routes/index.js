const router = require('express').Router({mergeParams: true});
const absPath = require('../config.js').public.absPath;
const media = require('../lib/slideshow').getState();
const {getShortLink} = require('../lib/shortLink.js');

router.get('/status', (req, res) => {
  res.send('Ok');
});

router.get('/shortlink', (req, res) => {
    return getShortLink(req.query.link)
    .then(link => {
        console.log(link)
        res.json({link});
    });
});

module.exports = router;
