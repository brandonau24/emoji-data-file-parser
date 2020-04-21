import fs from 'fs';
import path from 'path';

export default class EmojiDataParser {
	constructor(fileName) {
		this.fileName = fileName || 'emoji-data.json';
	}

	createFile() {
		try {
			const cwd = process.cwd();
			const parsedFileName = path.parse(this.fileName);

			if (parsedFileName.root || parsedFileName.dir) {
				throw Error('This script only takes in a file name, not a path. The file will be created in the directory the script is ran in.');
			}

			fs.accessSync(cwd, fs.constants.F_OK | fs.constants.W_OK);
			fs.writeFileSync(path.join(cwd, this.fileName), '');
		}
		catch (error) {
			console.log(error);
			process.exit(1);
		}
	}
}
