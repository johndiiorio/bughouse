const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'src/client/public');
const APP_DIR = path.resolve(__dirname, 'src/client/app');

const config = {
	entry: ['babel-polyfill', `${APP_DIR}/index.jsx`],
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.jsx?/,
				include: [APP_DIR],
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new LodashModuleReplacementPlugin()
	]
};

if (process.env.NODE_ENV === 'production') {
	config.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin()
	);
}

module.exports = config;
