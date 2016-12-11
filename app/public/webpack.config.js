module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'], // <-- changed line
                exclude: /node_modules/
            }
        ]
    }
}
