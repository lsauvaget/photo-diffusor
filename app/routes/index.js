const router = require('express').Router({mergeParams: true});
const absPath = require('../config.js').public.absPath;

router.get('/status', (req, res) => {
  res.send('Ok');
});

router.get('*', (req, res) => {
  res.sendFile(`${absPath}/index.html`);
});


module.exports = router;
