import fs from 'fs';
import path from 'path';

class EmojiDataFileCreator {
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

	_exitLog(exitCode, message, error) {
		console.log(message);
		console.log(error);
		console.log('Exiting...');
		process.exit(exitCode);
	}
}

export default EmojiDataFileCreator;
