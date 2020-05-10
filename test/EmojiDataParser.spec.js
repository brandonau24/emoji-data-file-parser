import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import EmojiDataParser from 'EmojiDataParser';
import EmojiDataApi from 'EmojiDataApi';

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
			const data = '# This is a comment';

			sinon.stub(EmojiDataApi.prototype, 'getData').resolves(data);

			return parser.getFilteredData().should.eventually.deep.equal({});
		});

		it('picks only fully-qualified emoji codepoints', () => {
			const data =
			`
				# This is a comment
				1F600                                      ; fully-qualified     # 😀 grinning face
				263A                                       ; unqualified         # ☺ smiling face
				1F44B                                      ; fully-qualified     # 👋 waving hand
				1F44B 1F3FB                                ; fully-qualified     # 👋🏻 waving hand: light skin tone
				1F471 200D 2642                            ; minimally-qualified # 👱‍♂ man: blond hair
			`;

			sinon.stub(EmojiDataApi.prototype, 'getData').resolves(data);

			return parser.getFilteredData().should.eventually.deep.equal({
				'1F600': {
					name: 'grinning face'
				},
				'1F44B': {
					name: 'waving hand'
				},
				'1F44B 1F3FB': {
					name: 'waving hand: light skin tone'
				}
			});
		});

		it('sets emoji name without emoji character and comment character', () => {
			const data =
			`
				1F600                                      ; fully-qualified     # 😀 grinning face
				1F44B                                      ; fully-qualified     # 👋 waving hand
				1F44B 1F3FB                                ; fully-qualified     # 👋🏻 waving hand: light skin tone
			`;

			sinon.stub(EmojiDataApi.prototype, 'getData').resolves(data);

			return parser.getFilteredData().should.eventually.deep.equal({
				'1F600': {
					name: 'grinning face'
				},
				'1F44B': {
					name: 'waving hand'
				},
				'1F44B 1F3FB': {
					name: 'waving hand: light skin tone'
				}
			});
		});

		it('adds sub-group to emoji name', () => {
			const data =
			`
				# subgroup: face-smiling
				1F600                                      ; fully-qualified     # 😀 grinning face
				# subgroup: face-affection
				1F970                                      ; fully-qualified     # 🥰 smiling face with hearts
				# subgroup: face-costume
				1F4A9                                      ; fully-qualified     # 💩 pile of poo
			`;

			sinon.stub(EmojiDataApi.prototype, 'getData').resolves(data);

			return parser.getFilteredData().should.eventually.deep.equal({
				'1F600': {
					name: 'grinning face face-smiling'
				},
				'1F970': {
					name: 'smiling face with hearts face-affection'
				},
				'1F4A9': {
					name: 'pile of poo face-costume'
				}
			});
		});
	});
});
