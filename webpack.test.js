const path = require('path');
const nodeExternals = require('webpack-node-externals');

const srcPath = path.resolve(__dirname, 'src');

module.exports = {
	resolve: {
		alias: {
			EmojiDataRetriever: path.resolve(srcPath, 'EmojiDataRetriever.js'),
			EmojiDataFileCreator: path.resolve(srcPath, 'EmojiDataFileCreator.js'),
			EmojiDataParser: path.resolve(srcPath, 'EmojiDataParser.js'),
			Logger: path.resolve(srcPath, 'Logger.js')
		},
		extensions: ['.js']
	},
	target: 'node',
	devtool: 'inline-cheap-module-source-map',
	externals: [nodeExternals()],
	stats: {
		// Ignore warnings due to yarg's dynamic module loading
		warningsFilter: [/node_modules\/yargs/]
	}
};
