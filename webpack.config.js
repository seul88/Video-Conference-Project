const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

/*
    Client
 */
const client = {
        entry: './src/client/client.js',
        output: {
            path: path.resolve(__dirname, 'dist/public'),
            filename: 'client.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/, loader: 'babel-loader',
                    exclude: path.join(__dirname, "node_modules")
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: './src/client/assets/html' }
            ]),
        ]
};

/*
    Server
 */
const server = {
    entry: './src/server/server.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [nodeExternals()],
};


module.exports = [client, server];
