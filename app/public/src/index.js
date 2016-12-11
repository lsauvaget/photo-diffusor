
if(/slideshow$/.test(location.pathname)){
    require('./slideshow.js');
}else {
    require('./remote.js');
}

