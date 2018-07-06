// const ngToolsWebpack = require('@ngtools/webpack');
const webpack = require('webpack');
const helpers = require('./helper.js');

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSCSS = new ExtractTextPlugin('assets/styles/[name].css');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const {
    AngularCompilerPlugin
} = require('@ngtools/webpack');

module.exports = {
    mode: 'development',
    entry: {
        polyfills: helpers.getRoot('src','polyfills.ts'),
        vendor: helpers.getRoot('src','vendor.ts'),
        app: helpers.getRoot('src','main.ts')
    },
    target: 'web',
    devtool: 'source-map',
    watch: true,
    output: {
        path: helpers.getRoot('dist'),
        publicPath: '/',
        filename: `[name].js`,
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [helpers.getRoot('src'), helpers.getRoot('node_modules')],
        alias: {
            ko: helpers.getRoot("node_modules","knockout"),
            // moment: helpers.getRoot('node_modules','moment','moment.js'),
        }
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: "vendors",
    //                 chunks: "all"
    //             }
    //         },
    //     }
    // },
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /.js$/,
                parser: {
                    system: true
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
                exclude: [
                    helpers.getRoot('src','app')
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'raw-loader',
                    'sass-loader'
                ],
                include: [
                    helpers.getRoot('src','app')
                ]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            /**
             * File loader for supporting images, for example, in CSS files.
             */
            {
              test: /\.(jpg|png|gif)$/,
              use: 'file-loader'
            },
            /* File loader for supporting fonts, for example, in CSS files.
            */
            {
              test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
              use: 'file-loader'
            },
            {
                test: /\.ts$/,
                loader: '@ngtools/webpack',
                // exclude: [/(component|module)\.(spec|e2e)\.ts$/],
            },
            // {
            //     test: /\.ts$/,
            //     loader: 'null-loader',
            //     include: [/\.(spec|e2e)\.ts$/],
            // },
            // {
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new HtmlWebpackPlugin({ //Inject scripts and links into index.html
            template: helpers.getRoot('src','index-wp.html')
        }),
        new AngularCompilerPlugin({
            platform: 0,
            entryModule: helpers.getRoot('src','app','app.module#AppModule'),
            sourceMap: true,
            tsConfigPath: helpers.getRoot('src','tsconfig.wp.json'),
            skipCodeGeneration: true,
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "window.jquery": "jquery",
            ko: "knockout",
            "window.ko": "knockout",
            "chai" : 'chai',
            "window.chai" : "chai",
            "moment" : 'moment',
            'window.moment' : 'moment'
        }),
        new CopyWebpackPlugin([
            { from: 'src/index-wp.html', to: helpers.getRoot('dist', 'index.html') },
            { from: 'src/assets/images', to: helpers.getRoot('dist', 'assets/images') },
            { from: 'node_modules/knockout-daterangepicker-fb/README.md', to: helpers.getRoot('dist', 'assets') },
            { from: 'node_modules/knockout-daterangepicker-fb/docs', to: helpers.getRoot('dist', 'assets','docs') },
            { from: 'node_modules/mocha/mocha.js', to: helpers.getRoot('dist', 'assets', 'scripts') },
            { from: 'node_modules/moment/moment.js', to: helpers.getRoot('dist', 'assets', 'scripts') }
        ]),
    ],
    node: {
        fs: "empty",
    },
    devServer: {
        // stats: 'verbose',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
    }
};
