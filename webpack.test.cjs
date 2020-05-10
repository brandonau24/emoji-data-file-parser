const path = require('path');
const RemovePlugin = require('remove-files-webpack-plugin');

const srcPath = path.resolve(__dirname, 'src');
const testPath = path.resolve(__dirname, 'test');
const outputBundleName = 'tests.js';

module.exports = {
	entry: path.resolve(testPath, 'index.js'),
	output: {
		path: path.resolve(__dirname),
		filename: outputBundleName
	},
	resolve: {
		alias: {
			EmojiDataApi: path.resolve(srcPath, 'EmojiDataApi.js'),
			EmojiDataFileCreator: path.resolve(srcPath, 'EmojiDataFileCreator.js'),
			EmojiDataParser: path.resolve(srcPath, 'EmojiDataParser.js')
		},
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /spec\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				]
			}
		],
	},
	target: 'node',
	devtool: 'cheap-eval-source-map',
	plugins: [
		new RemovePlugin({
			before: {
				include: [outputBundleName]
			}
		})
	]
};
