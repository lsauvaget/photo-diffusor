const root = document.querySelector('#root');

window.onload = () => {
    switch(location.pathname) {
        case '/slideshow':
            root.appendChild(require('./slideshow/index.js'));
            break;
        default:
            root.appendChild(require('./remote/index.js'));
    }
}
