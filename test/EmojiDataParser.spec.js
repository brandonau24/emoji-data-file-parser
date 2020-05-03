import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import EmojiDataParser from '../src/EmojiDataParser.js';
import EmojiDataApi from '../src/EmojiDataApi.js';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('EmojiDataParser', () => {
	let parser;

	beforeEach(() => {
		parser = new EmojiDataParser();
		sinon.stub(console, 'log');
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('#filterData', () => {
		it('ignores comments', () => {
			const data = 
			`
				# This is a comment
				# group: Group-1
				# subgroup: subgroup-1
				1F600                                      ; fully-qualified     # 😀 grinning face
				263A                                       ; unqualified         # ☺ smiling face
			`;

			sinon.stub(EmojiDataApi.prototype, 'getData').resolves(data);

			return parser.getFilteredData().should.eventually.deep.equal({});
		});
	});
});
