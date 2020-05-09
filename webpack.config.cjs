const path = require('path');

const srcPath = path.resolve(__dirname, 'src');

module.exports = {
	entry: path.resolve(srcPath, 'index.js'),
	output: {
		path: path.resolve(__dirname),
		filename: 'emoji-data-file-parser.js'
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
	target: 'async-node'
};
