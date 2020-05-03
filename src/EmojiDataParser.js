import EmojiDataApi from './EmojiDataApi.js';

export default class EmojiDataParser {

	getFilteredData() {
		const emojiDataApi = new EmojiDataApi();
		
		return emojiDataApi.getData().then(() => {
			return {};
		});
	}

	_exitLog(exitCode, message, error) { 
		console.log(message);
		console.log(error);
		console.log('Exiting...');
		process.exit(exitCode);
	}
}
