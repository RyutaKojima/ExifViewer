var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
    {
        context: path.join(__dirname, 'src/sass'),
        entry: {
            main: './main.scss'
        },
        output: {
            path: path.join(__dirname, 'docs/css'),
            filename: '[name].css'
        },
        module: {
            loaders: [
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: "css-loader",
						publicPath: "build"
					})
				},
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract({
						fallback: 'style-loader', 
						use: 'css-loader!sass-loader',
						publicPath: 'build'
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].css')
        ]
    }
];