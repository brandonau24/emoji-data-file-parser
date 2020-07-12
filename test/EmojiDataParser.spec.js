import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import EmojiDataParser from 'EmojiDataParser';
import EmojiDataRetriever from 'EmojiDataRetriever';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('EmojiDataParser', () => {
	const version = '12.0';
	let parser;

	beforeEach(() => {
		parser = new EmojiDataParser();
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('#filterData', () => {
		it('ignores comments', () => {
			const data = '# This is a comment';

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version).should.eventually.deep.equal({
				version
			});
		});
	});
});
