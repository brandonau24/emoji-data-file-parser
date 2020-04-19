import fs from 'fs';

export default class EmojiDataParser {
	createFile() {
		fs.accessSync(process.cwd(), fs.constants.F_OK | fs.constants.W_OK);
		fs.writeFile('emoji-data.json', '', () => {

		});
	}
}
