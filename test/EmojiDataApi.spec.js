import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import https from 'https';
import EmojiDataApi from '../src/EmojiDataApi.js';

chai.should();
chai.use(sinonChai);

describe('EmojiDataApi', () => {
	let getStub;
	let emojiDataApi;
	
	beforeEach(() => {
		getStub = sinon.stub(https, 'get');
		emojiDataApi = new EmojiDataApi();
	});

	afterEach(() => {
		sinon.restore();
	});

	it('makes a request to get emoji data file', () => {
		emojiDataApi.getData('12.0');
		
		const expectedRequestUrl = 'https://www.unicode.org/Public/emoji/12.0/emoji-test.txt';
		getStub.should.have.been.calledOnceWith(expectedRequestUrl);
	});

	it('makes a request to get emoji data file with specific version', () => {
		emojiDataApi.getData('13.0');

		const expectedRequestUrl = 'https://www.unicode.org/Public/emoji/13.0/emoji-test.txt';
		getStub.should.have.been.calledOnceWith(expectedRequestUrl);
	});
});
