import EmojiDataRetriever from 'EmojiDataRetriever';

export default class EmojiDataParser {
	getFilteredData(version) {
		const emojiDataRetriever = new EmojiDataRetriever();

		return emojiDataRetriever.getData(version).then(data => {
			if (!data) {
				return null;
			}

			const lines = data.split('\n');

			const filteredData = {
				version
			};

			let groupName;
			let subgroupName;

			for (let line of lines) {
				line = line.trim();

				if (line.includes('# group')) {
					const startOfGroupNameIndex = line.indexOf(':') + 2;
					groupName = line.substring(startOfGroupNameIndex);
					filteredData[groupName] = {};
				}
				else if (line.includes('# subgroup')) {
					const startOfSubgroupIndex = line.indexOf(':') + 2;
					subgroupName = line.substring(startOfSubgroupIndex);
					filteredData[groupName][subgroupName] = [];
				}
				else if(line.charAt(0) === '#'){
					continue;
				}

				if (line.includes('fully-qualified')) {
					const endCodepointSectionIndex = line.indexOf(';');
					const codepoints = line.substring(0, endCodepointSectionIndex).trim();
					const emojiName = this._getEmojiName(codepoints, line);
	
					const emoji = {
						codepoints,
						name: emojiName
					};
	
					filteredData[groupName][subgroupName].push(emoji);
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
}
