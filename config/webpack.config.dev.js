const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config.common.js');

module.exports = merge(commonConfig, {
    mode: 'development',
    devServer: {
        contentBase: '../dist'
    },
    // generate source map
    devtool: 'inline-source-map'
});