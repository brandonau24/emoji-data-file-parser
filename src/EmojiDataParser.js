import fs from 'fs';

export default class EmojiDataParser {
	createFile() {
		fs.writeFile('emoji-data.json', '', () => {

		});
	}
}
