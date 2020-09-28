const path = require('path');
const config = require('config');

module.exports = {
    // entry file(s)
    entry: './src/index.js',
    output: {
        library: 'knockout-daterangepicker-fb',
        libraryTarget: 'umd',
        globalObject: '(typeof self !== "undefined" ? self : this)',
        libraryExport: 'default',
        path: path.join(__dirname, '../dist'),
        filename: 'daterangepicker.umd.js',
        publicPath: config.get('publicPath')
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        open: config.get('open')
    }
};