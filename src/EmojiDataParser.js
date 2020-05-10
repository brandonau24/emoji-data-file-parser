import EmojiDataApi from 'EmojiDataApi';

export default class EmojiDataParser {

	getFilteredData() {
		const emojiDataApi = new EmojiDataApi();

		return emojiDataApi.getData().then(data => {
			let filteredData = {};
			let groupName;
			let currentGroup;
			let subgroup;
			const lines = data.split('\n');

			for (let line of lines) {
				line = line.trim();

				if (line.includes('# group:')) {
					const startOfGroupNameIndex = line.indexOf(':') + 2;
					groupName = line.substring(startOfGroupNameIndex);
					filteredData[groupName] = {};
					currentGroup = filteredData[groupName];
				}
				else if (line.includes('# subgroup:')) {
					const startOfSubgroupIndex = line.indexOf(':') + 2;
					subgroup = line.substring(startOfSubgroupIndex);
				}
				else if (line.charAt(0) === '#') {
					continue;
				}
				
				if (line.includes('fully-qualified')) {
					const endCodepointSectionIndex = line.indexOf(';');
					const codepoints = line.substring(0, endCodepointSectionIndex).trim();
					const emojiName = this._getEmojiName(codepoints, line);

					currentGroup[codepoints] = {
						name: `${emojiName} ${subgroup}`
					};
				}
			}

			return filteredData;
		});
	}

	_getEmojiName(codepoints, line) {
		const prefixedCodepoints = this._prefixCodepoints(codepoints);
		
		//An emoji is represented by 16 bits.
		//However, when it's encoded, it is made up of 2 or more sequences 😀 (1F600) = \uD83D\uDE00
		//The fromCodePoint method returns \uD83D\uDE00 for 1F600 which is a length of 2 according to the standard
		const unicodeStrLength = String.fromCodePoint(...prefixedCodepoints).length;
		const startNameSectionIndex = line.lastIndexOf('#');
		
		//Add 3 due to space between # and emoji, and the emoji and its name
		return line.substring(startNameSectionIndex + unicodeStrLength + 3).trim();
	}

	_prefixCodepoints(codepoints) {
		//String.fromCodePoint won't accept parameters that do not have the 0x prefix
		return codepoints.split(' ').map(codepoint => {
			return `0x${codepoint}`;
		});
	}

	_exitLog(exitCode, message, error) {
		console.log(message);
		console.log(error);
		console.log('Exiting...');
		process.exit(exitCode);
	}
}
