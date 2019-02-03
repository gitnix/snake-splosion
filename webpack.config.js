const path = require('path')
const exec = require('child_process').exec
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
	entry: './client/index.js',
	output: {
		path: path.resolve(__dirname, 'dist/compiled'),
		filename: '[contenthash].js',
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: path.resolve(__dirname, 'node_modules'),
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.js$/,
				exclude: path.resolve(__dirname, 'node_modules'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
			},
			{
				test: /\.(png|jpg|gif|ttf)$/,
				use: ['url-loader'],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(['dist/compiled'], { watch: true }),
		new MiniCssExtractPlugin({
			filename: '[contenthash].css',
			chunkFilename: '[id].css',
		}),
		{
			apply: compiler => {
				compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
					console.log('building dist/index.html...')
					exec('yarn build:html', (err, stdout, stderr) => {
						if (stdout) process.stdout.write(stdout)
						if (stderr) process.stderr.write(stderr)
					})
				})
			},
		},
	],
}
