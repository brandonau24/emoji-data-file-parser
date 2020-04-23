import https from 'https';

export default class EmojiDataApi {
	getData(version) {
		https.get(`https://www.unicode.org/Public/emoji/${version}/emoji-test.txt`);
	}
}
