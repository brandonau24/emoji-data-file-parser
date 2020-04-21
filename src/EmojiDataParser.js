import fs from 'fs';

export default class EmojiDataParser {
	constructor(fileName) {
		this.fileName = fileName || 'emoji-data.json';
	}

	createFile() {
		try {
			fs.accessSync(process.cwd(), fs.constants.F_OK | fs.constants.W_OK);
			fs.writeFileSync(this.fileName, '');
		}
		catch (error) {
			console.log(error);
			process.exit(1);
		}
	}
}
