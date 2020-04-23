import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import https from 'https';
import EmojiDataApi from '../src/EmojiDataApi.js';

chai.should();
chai.use(sinonChai);

describe('EmojiDataApi', () => {
	it('makes a request to get emoji data file', () => {
		const getStub = sinon.stub(https, 'get');
		const emojiDataApi = new EmojiDataApi();

		emojiDataApi.getData();
		
		const expectedRequestUrl = 'https://www.unicode.org/Public/emoji/12.0/emoji-test.txt';
		getStub.should.have.been.calledOnceWith(expectedRequestUrl);
	});
});
