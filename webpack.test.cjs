const path = require('path');

const srcPath = path.resolve(__dirname, 'src');
const testPath = path.resolve(__dirname, 'test');

module.exports = {
	entry: path.resolve(testPath, 'index.js'),
	output: {
		path: path.resolve(__dirname),
		filename: 'tests.js'
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
	devtool: 'cheap-eval-source-map'
};
