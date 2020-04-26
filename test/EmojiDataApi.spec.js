import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import axios from 'axios';
import EmojiDataApi from '../src/EmojiDataApi.js';

const expect = chai.expect;
chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('EmojiDataApi', () => {
	let getStub;
	let emojiDataApi;
	
	beforeEach(() => {
		getStub = sinon.stub(axios, 'get').resolves();
		sinon.stub(console, 'log');

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

	it('makes a request with proper http headers', () => {
		emojiDataApi.getData();

		const expectedRequestUrl = 'https://www.unicode.org/Public/emoji/12.0/emoji-test.txt';
		const expectedOptions = {
			headers: {
				Accept: 'text/plain',
				'Accept-Charset': 'utf-8'
			},
			responseType: 'text',
			responseEncoding: 'utf8'
		};

		getStub.should.have.been.calledOnceWithExactly(expectedRequestUrl, expectedOptions);
	});

	it('returns no data when version is not a number', () => {
		const isNanSpy = sinon.spy(Number, 'isNaN');
		const parseFloatSpy = sinon.spy(parseFloat);

		const actual = emojiDataApi.getData('a');

		isNanSpy.should.have.returned(true);
		isNaN(parseFloatSpy.returnValues[0]).should.be.true;
		expect(actual).to.be.null;
	});

	it('returns no data when response returns with an error', () => {
		getStub.rejects({
			response: {
				status: 400,
				statusText: 'Bad request'
			}
		});

		return emojiDataApi.getData().should.eventually.be.null;
	});
	
	it('returns no data when there is no response', () => {
		getStub.rejects({
			request: {
				status: 400,
				statusText: 'Bad request'
			}
		});

		return emojiDataApi.getData().should.eventually.be.null;
	});
});
