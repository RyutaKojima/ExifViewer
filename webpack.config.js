const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PRODUCTION = process.env.NODE_ENV === 'production';

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
		devtool: (PRODUCTION ? false : 'inline-source-map'),
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
						use: (PRODUCTION
								? 'css-loader?url=false&minimize!sass-loader'
								: 'css-loader?url=false&sourceMap!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
						),
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