import https from 'https';

export default class EmojiDataApi {
	getData(version = '12.0') {
		https.get(`https://www.unicode.org/Public/emoji/${version}/emoji-test.txt`);
	}
}
