import EmojiDataApi from './EmojiDataApi.js';

export default class EmojiDataParser {

	getFilteredData() {
		const emojiDataApi = new EmojiDataApi();

		return emojiDataApi.getData().then(data => {
			let filteredData = {};
			const lines = data.split('\n');

			for (let line of lines) {
				line = line.trim();
				if (line.charAt(0) === '#') {
					continue;
				}
				
				if (line.includes('fully-qualified')) {
					const endCodepointSectionIndex = line.indexOf(';');
					const codepoints = line.substring(0, endCodepointSectionIndex).trim();

					filteredData[codepoints] = {
						name: this._getEmojiName(codepoints, line)
					};
				}
			}

			return filteredData;
		});
	}

	_getEmojiName(codepoints, line) {
		//An emoji is represented by 16 bits.
		//However, when it's encoded, it is made up of 2 or more sequences 😀 = \uD83D\uDE00
		//Multiplying by 2 for the amount of codepoints for the emoji are how many sequences there are that appear in the string
		const numOfSequences = codepoints.split(' ').length * 2;
		const startNameSectionIndex = line.lastIndexOf('#');
		
		//Add 3 due to space between # and emoji, and the emoji and its name 
		return line.substring(startNameSectionIndex + numOfSequences + 3).trim();
	}

	_exitLog(exitCode, message, error) {
		console.log(message);
		console.log(error);
		console.log('Exiting...');
		process.exit(exitCode);
	}
}
