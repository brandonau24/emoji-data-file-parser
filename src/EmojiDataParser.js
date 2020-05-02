import fs from 'fs';
import path from 'path';
import EmojiDataApi from './EmojiDataApi.js';

export default class EmojiDataParser {
	createFile(fileName = 'emoji-data.json') {
		const parsedFileName = path.parse(fileName);

		if (parsedFileName.root || parsedFileName.dir) {
			this._exitLog(1, `The provided name ${fileName} is a path or a file name including a path. This program only supports creating the file in the current working directory (the directory this script was ran in).`);
		}

		const cwd = process.cwd();
		const filePath = path.join(cwd, fileName);
		
		fs.writeFile(filePath, '', error => {
			if (error) {
				this._exitLog(1, `Cannot create/write ${filePath}...`, error);
			}
		});
	}

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
