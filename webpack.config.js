const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require( 'path' );

const distPath = path.join(__dirname, '/public');


module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        sourceMapFilename: 'bundle.js.map',
        path: distPath
    },
    devServer: {
        publicPath: "/src"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};