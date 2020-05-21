const path = require('path');
const webpack = require('webpack');
const RemovePlugin = require('remove-files-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const srcPath = path.resolve(__dirname, 'src');
const outputBundleName = 'emoji-data-file-parser.js';

module.exports = {
	entry: path.resolve(srcPath, 'index.js'),
	output: {
		path: path.resolve(__dirname),
		filename: outputBundleName
	},
	resolve: {
		alias: {
			EmojiDataRetriever: path.resolve(srcPath, 'EmojiDataRetriever.js'),
			EmojiDataFileCreator: path.resolve(srcPath, 'EmojiDataFileCreator.js'),
			EmojiDataParser: path.resolve(srcPath, 'EmojiDataParser.js'),
			Logger: path.resolve(srcPath, 'Logger.js')
		},
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}	
		],
	},
	target: 'async-node',
	plugins: [
		new RemovePlugin({
			before: {
				include: [outputBundleName]
			}
		}),
		new webpack.BannerPlugin({
			banner: '#!/usr/bin/env node',
			raw: true
		})
	],
	stats: {
		// Ignore warnings due to yarg's dynamic module loading
		warningsFilter: [/node_modules\/yargs/]
	},
	externals: [nodeExternals()]
};
