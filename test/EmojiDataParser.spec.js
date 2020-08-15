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
		it('passes version number to data retriever', () => {
			const getDataStub = sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves('');

			parser.getFilteredData(version);

			getDataStub.should.have.been.calledOnceWithExactly(version);
		});

		it('sets Unicode version property', () => {
			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves('\n');

			return parser.getFilteredData(version).should.eventually.deep.equal({
				version
			});
		});
		
		it('ignores comments', () => {
			const data = '# This is a comment';

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version).should.eventually.deep.equal({
				version
			});
		});

		it('returns null when API returns no data', () => {
			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(null);

			return parser.getFilteredData(version).should.eventually.be.null;
		});

		it('creates emoji groups', () => {
			const data =
			`
				# group: group1
				# group: group2
				# group: group3
			`;

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version).should.eventually.deep.equal({
				version,
				group1: {},
				group2: {},
				group3: {}
			});
		});

		it('creates subgroups within groups', () => {
			const data =
				`
				# group: group1
				# subgroup: subgroup1
				# subgroup: subgroup2
				# subgroup: subgroup3

				# group: group2
				# subgroup: subgroup1
				# subgroup: subgroup2
				# subgroup: subgroup3

				# group: group3
				# subgroup: subgroup1
				# subgroup: subgroup2
				# subgroup: subgroup3
			`;

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version).should.eventually.deep.equal({
				version,
				group1: {
					subgroup1: [],
					subgroup2: [],
					subgroup3: []
				},
				group2: {
					subgroup1: [],
					subgroup2: [],
					subgroup3: []
				},
				group3: {
					subgroup1: [],
					subgroup2: [],
					subgroup3: []
				}
			});
		});

		it('fills subgroups with emoji data', () => {
			const data =
			`
				# This is a comment	
				# group: Smileys & Emotion	
				# subgroup: face-smiling	
				1F600                                      ; fully-qualified     # 😀 grinning face	
				1F603                                      ; fully-qualified     # 😃 grinning face with big eyes

				# subgroup: face-affection
				1F970                                      ; fully-qualified     # 🥰 smiling face with hearts

				# group: Animals & Nature
				# subgroup: animal-mammal
				1F435                                      ; fully-qualified     # 🐵 monkey face
			`;

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);
			
			return parser.getFilteredData(version).should.eventually.deep.equal({
				version,
				'Smileys & Emotion': {
					'face-smiling': [
						{
							codepoints: '1F600',
							name: 'grinning face'
						},
						{
							codepoints: '1F603',
							name: 'grinning face with big eyes'
						}
					],
					'face-affection': [
						{
							codepoints: '1F970',
							name: 'smiling face with hearts'
						}
					]
				},
				'Animals & Nature': {
					'animal-mammal': [
						{
							codepoints: '1F435',
							name: 'monkey face'
						}
					],
				}
			});
		});

		it('picks only fully-qualified emojis', () => {
			const data =
			`
				# group: Smileys & Emotion
				# subgroup: face-affection
				1F617                                      ; fully-qualified     # 😗 kissing face
				263A FE0F                                  ; unqualified              # ☺️ smiling face
			`;

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version).should.eventually.deep.equal({
				version,
				'Smileys & Emotion': {
					'face-affection': [
						{
							codepoints: '1F617',
							name: 'kissing face'
						}
					]
				}
			});
		});

		it('does not include emoji unicode version in the name', () => {
			const data =
			`
				# group: Smileys & Emotion

				# subgroup: face-smiling
				1F600                                      ; fully-qualified     # 😀 E1.0 grinning face
				# subgroup: face-affection
				1F970                                      ; fully-qualified     # 🥰 E11.0 smiling face with hearts
			`;
			const version = '13.0';

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version).should.eventually.deep.equal({
				version,
				'Smileys & Emotion': {
					'face-smiling': [
						{
							codepoints: '1F600',
							name: 'grinning face'
						}
					],
					'face-affection': [
						{
							codepoints: '1F970',
							name: 'smiling face with hearts'
						}
					]
				}
			});
		});
	});
});
