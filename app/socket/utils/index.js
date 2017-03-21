module.exports = {
    socketManager: require('./SocketManagerHelper.js'),
    socketMiddleware: require('./SocketMiddlewaresFactory.js')()
}
