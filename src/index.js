import yargs from 'yargs';
import EmojiDataFileCreator from 'EmojiDataFileCreator';

const args = yargs
	.options({
		'unicodeVersion': {
			alias: 'u',
			type: 'string',
			demandOption: false,
			description: 'Unicode Version for Emoji Standard',
			default: '12.0'
		},
		'output-file': {
			alias: 'o',
			type: 'string',
			demandOption: false,
			description: 'Name of the output JSON file',
			default: 'emoji-data.json'
		}
	})
	.version(false)
	.parserConfiguration({
		'parse-numbers': false
	})
	.help()
	.argv;

new EmojiDataFileCreator().createFile(args.outputFile, args.unicodeVersion).then(() => {
	console.log('Done!');
});
