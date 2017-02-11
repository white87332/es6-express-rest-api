const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

function getExternals()
{
    const nodeModules = fs.readdirSync(path.join(process.cwd(), 'node_modules'));
    return nodeModules.reduce((ext, mod) =>
    {
        ext[mod] = `commonjs ${mod}`;
        return ext;
    }, {});
}

module.exports = {
    target: 'node',
    entry: path.join(process.cwd(), 'index'),
    output: {
        path: path.join(process.cwd(), 'build'),
        filename: 'index.js',
        chunkFilename: '[id].js'
    },
    externals: [getExternals()],
    node: {
        __filename: true,
        __dirname: true
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less|scss|svg|png|jpe?g|png)$/),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ]
};
