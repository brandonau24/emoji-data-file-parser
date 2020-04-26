import axios from 'axios';

export default class EmojiDataApi {
	getData(version = '12.0') {
		if (Number.isNaN(parseFloat(version))) {
			return null;
		}

		const options = {
			headers: {
				Accept: 'text/plain',
				'Accept-Charset': 'utf-8'
			},
			responseType: 'text',
			responseEncoding: 'utf8'
		};

		axios.get(`https://www.unicode.org/Public/emoji/${version}/emoji-test.txt`, options);
	}
}
