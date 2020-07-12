const webpack = require('webpack');
const path = require('path');
const appPath = __dirname;
const distPath = path.join(__dirname, 'dist');
const exclude = [/node_modules/];
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'web',
    context: appPath,
    entry: {
        app: ['./js/client.js']
    },
    output: {
        path: distPath,
        filename: 'bundle.js'
    },
    plugins: [

        new MiniCssExtractPlugin({
            filename: "styles.css"
        }),

        // Generate index.html with included script tags
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './template.html'
        }),

        // new CopyWebpackPlugin([
        //     {
        //         from: "js/middlewares/deeplearn/model",
        //         to: "model"
        //     }
        // ])

    ],
    module: {
        noParse: [/app\/bin/],
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader",
                }, {
                    loader: "css-loader",
                }, {
                    loader: "sass-loader",
                    options: {
                        implementation: require('sass'),
                    }
                }]
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                query: {
                    comments: false,
                    compact: false,
                    presets: [
                        "@babel/preset-react"
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }]
                    ]
                }
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [{
                    loader: "url-loader"
                    // options: {
                    //     limit: 8192
                    // }
                }]
            },
            {
                type: 'javascript/auto',
                test: /\.(json)/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'file-loader',
                    options: { name: '[name].[ext]' },
                }],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "babel-loader",
                        query: {
                            comments: false,
                            compact: false,
                            presets: [
                                "@babel/preset-react",
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }]
                            ],
                        }
                    },
                    {
                        loader: "react-svg-loader"
                    }
                ]
            },
            // {
            //     test: /\.svg$/,
            //     use: [{ loader: 'url-loader?mimetype=image/svg+xml&name=[path][name].[ext]' }]
            // },
            {
                test: /\.woff$/,
                use: { loader: 'url-loader?mimetype=application/font-woff&name=[path][name].[ext]' },
            },
            {
                test: /\.woff2$/,
                use: { loader: 'url-loader?mimetype=application/font-woff2&name=[path][name].[ext]' },
            },
            {
                test: /\.[ot]tf$/,
                use: { loader: 'url-loader?mimetype=application/octet-stream&name=[path][name].[ext]' },
            },
            {
                test: /\.eot$/,
                use: { loader: 'url-loader?mimetype=application/vnd.ms-fontobject&name=[path][name].[ext]' },
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            },
        ]
    },
    resolve: {
        modules: [
            appPath,
            "node_modules",
            ".",
        ],
        extensions: ['.wasm', '.mjs', '.js', '.json']
    },
    node: {
        fs: 'empty'
    }
};