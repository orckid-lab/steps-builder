// webpack.config.js
var path = require('path');

module.exports = {
    entry: ['./src/js/app'], // file extension after index is optional for .js files
    devtool: "#inline-source-map",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js'
    }
};