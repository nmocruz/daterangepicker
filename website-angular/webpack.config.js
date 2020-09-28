const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const commonConfig = require('./config/webpack.common.js');

module.exports = webpackMerge(
    commonConfig, {
        externals: [nodeExternals()],
        devServer: {
            stats: {
                modules: false,
                moduleTrace: false
            }
        }
    },
);
