import fs from 'fs';

export default class EmojiDataParser {
	createFile() {
		try {
			fs.accessSync(process.cwd(), fs.constants.F_OK | fs.constants.W_OK);
			fs.writeFile('emoji-data.json', '', () => {

			});
		}
		catch (error) {
			console.log(error);
			process.exit(1);
		}
	}
}
