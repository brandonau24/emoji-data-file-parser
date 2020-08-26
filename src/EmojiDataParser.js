import EmojiDataRetriever from 'EmojiDataRetriever';

export default class EmojiDataParser {
	getFilteredData(version, removeModifiers) {
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

				if ((line.includes('# group: Component') || 
						line.includes('skin-tone') ||
						line.includes('hair-style')) && removeModifiers) {
					continue;
				}
				else if (line.includes('# group')) {
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
				else if (line.includes('skin tone') && removeModifiers) {
					continue;
				}
				else if (line.includes('fully-qualified')) {
					const codepoints = this._getCodepoints(line);
					const emojiName = this._getEmojiName(line);

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

	_getEmojiName(line) {
		const startNameSectionIndex = line.lastIndexOf('#');
		const nameSection = line.substring(startNameSectionIndex);

		// Assumes that the name starts with a lowercase letter
		const startOfEmojiName = nameSection.search(/[a-z]/);
		
		return nameSection.substring(startOfEmojiName);
	}

	_getCodepoints(line) {
		const endCodepointSectionIndex = line.indexOf(';');
		
		return line.substring(0, endCodepointSectionIndex).trim();
	}
}
