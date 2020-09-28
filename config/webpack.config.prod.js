const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

const config = require('config');

module.exports = merge(commonConfig, {
    mode: 'production',
    devServer: {
        historyApiFallback: true,

        open: config.get('open')
    },
    // generate source map
    devtool: 'source-map'
});