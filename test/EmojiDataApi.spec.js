import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import https from 'https';
import EmojiDataApi from '../src/EmojiDataApi.js';

const expect = chai.expect;
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

	it('makes a request to get emoji data file with default version', () => {
		emojiDataApi.getData();

		const expectedRequestUrl = 'https://www.unicode.org/Public/emoji/12.0/emoji-test.txt';
		getStub.should.have.been.calledOnceWith(expectedRequestUrl);
	});

	it('makes a request to get emoji data file with specific version', () => {
		emojiDataApi.getData('13.0');

		const expectedRequestUrl = 'https://www.unicode.org/Public/emoji/13.0/emoji-test.txt';
		getStub.should.have.been.calledOnceWith(expectedRequestUrl);
	});

	it('returns no data when version is not a number', () => {
		const isNanSpy = sinon.spy(Number, 'isNaN');
		const parseFloatSpy = sinon.spy(parseFloat);

		const actual = emojiDataApi.getData('a');

		isNanSpy.should.have.returned(true);
		isNaN(parseFloatSpy.returnValues[0]).should.be.true;
		expect(actual).to.be.null;
	});
});
