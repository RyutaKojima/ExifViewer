const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
	const PRODUCTION = (env === 'production');
	console.log("Build ENV=" + env);

	return [
		{// Sass
			devtool: (PRODUCTION ? false : 'inline-source-map'),
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
		},
		{// ECMA Script2015(ES6)
			devtool: (PRODUCTION ? false : 'inline-source-map'),
			context: path.join(__dirname, 'src/es2015'),
			entry: {
				main: './main.js',
			},
			output: {
				path: path.join(__dirname, 'docs/js'),
				filename: '[name].js'
			},
			module: {
				loaders: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: "babel-loader",
						query:{
							presets: ['es2015']
						}
					}
				]
			}
		}
	];
};