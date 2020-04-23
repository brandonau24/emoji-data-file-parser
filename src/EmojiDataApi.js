import https from 'https';

export default class EmojiDataApi {
	getData() {
		https.get('https://www.unicode.org/Public/emoji/12.0/emoji-test.txt');
	}
}
