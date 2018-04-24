const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './client/client.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: path.resolve(__dirname, 'node_modules'),
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.js$/,
				exclude: path.resolve(__dirname, 'node_modules'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: ['url-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			title: 'Snake Multiplayer',
		}),
	],
}
