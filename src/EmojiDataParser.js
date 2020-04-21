import fs from 'fs';
import path from 'path';

export default class EmojiDataParser {
	constructor(fileName) {
		this.fileName = fileName || 'emoji-data.json';
	}

	createFile() {
		try {
			const cwd = process.cwd();
			fs.accessSync(cwd, fs.constants.F_OK | fs.constants.W_OK);
			fs.writeFileSync(path.join(cwd, this.fileName), '');
		}
		catch (error) {
			console.log(error);
			process.exit(1);
		}
	}
}
