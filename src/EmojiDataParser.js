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
					const codepoint = line.substring(0, endCodepointSectionIndex).trim();

					filteredData[codepoint] = {};
				}
			}

			return filteredData;
		});
	}

	_exitLog(exitCode, message, error) {
		console.log(message);
		console.log(error);
		console.log('Exiting...');
		process.exit(exitCode);
	}
}
