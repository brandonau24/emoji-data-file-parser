import fs from 'fs';
import path from 'path';
import EmojiDataParser from 'EmojiDataParser';
import Logger from 'Logger';

class EmojiDataFileCreator {
	createFile(fileName = 'emoji-data.json', version) {
		const parsedFileName = path.parse(fileName);

		if (parsedFileName.root || parsedFileName.dir) {
			Logger.exitLog(1, `The provided name ${fileName} is a path or a file name including a path. This program only supports creating the file in the current working directory (the directory this script was ran in).`);
		}

		const cwd = process.cwd();
		const filePath = path.join(cwd, fileName);

		const parser = new EmojiDataParser();

		return parser.getFilteredData(version).then(data => {
			if (!data) {
				Logger.exitLog(1, 'No data was returned...');
			}
			else {
				console.log(`Creating ${fileName}...`);

				fs.writeFile(filePath, JSON.stringify(data), error => {
					if (error) {
						Logger.exitLog(1, `Cannot create/write ${filePath}...`, error);
					}
				});
			}
		});
	}
}

export default EmojiDataFileCreator;
