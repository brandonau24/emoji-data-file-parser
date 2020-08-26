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

		it('ignores modifiers when remove modifiers flag is true', () => {
			const data =
			`
			# group: People & Body

			# subgroup: hand-fingers-open
			1F44B                                      ; fully-qualified     # 👋 E0.6 waving hand
			1F44B 1F3FC                                ; fully-qualified     # 👋🏼 E1.0 waving hand: medium-light skin tone
			1F44B 1F3FD                                ; fully-qualified     # 👋🏽 E1.0 waving hand: medium skin tone
			1F44B 1F3FF                                ; fully-qualified     # 👋🏿 E1.0 waving hand: dark skin tone

			# subgroup: hand-fingers-partial
			1F44C                                      ; fully-qualified     # 👌 E0.6 OK hand
			1F44C 1F3FB                                ; fully-qualified     # 👌🏻 E1.0 OK hand: light skin tone
			1F44C 1F3FC                                ; fully-qualified     # 👌🏼 E1.0 OK hand: medium-light skin tone
			`;

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version, true).should.eventually.deep.equal({
				version,
				'People & Body': {
					'hand-fingers-open': [
						{
							codepoints: '1F44B',
							name: 'waving hand'
						}
					],
					'hand-fingers-partial': [
						{
							codepoints: '1F44C',
							name: 'hand'
						}
					]
				}
			});
		});

		it('ignores components when remove modifiers flag is true', () => {
			const data =
			`
			# group: Component

			# subgroup: skin-tone
			1F3FB                                      ; component           # 🏻 E1.0 light skin tone
			1F3FC                                      ; component           # 🏼 E1.0 medium-light skin tone
			1F3FD                                      ; component           # 🏽 E1.0 medium skin tone
			1F3FE                                      ; component           # 🏾 E1.0 medium-dark skin tone
			1F3FF                                      ; component           # 🏿 E1.0 dark skin tone

			# subgroup: hair-style
			1F9B0                                      ; component           # 🦰 E11.0 red hair
			1F9B1                                      ; component           # 🦱 E11.0 curly hair
			1F9B3                                      ; component           # 🦳 E11.0 white hair
			1F9B2                                      ; component           # 🦲 E11.0 bald
			`;

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version, true).should.eventually.deep.equal({
				version
			});
		});
		
		it('adds components when remove modifiers flag is false', () => {
			const data =
			`
			# group: Component

			# subgroup: skin-tone
			1F3FB                                      ; component           # 🏻 E1.0 light skin tone
			1F3FC                                      ; component           # 🏼 E1.0 medium-light skin tone
			1F3FD                                      ; component           # 🏽 E1.0 medium skin tone
			1F3FE                                      ; component           # 🏾 E1.0 medium-dark skin tone
			1F3FF                                      ; component           # 🏿 E1.0 dark skin tone

			# subgroup: hair-style
			1F9B0                                      ; component           # 🦰 E11.0 red hair
			1F9B1                                      ; component           # 🦱 E11.0 curly hair
			1F9B3                                      ; component           # 🦳 E11.0 white hair
			1F9B2                                      ; component           # 🦲 E11.0 bald
			`;

			sinon.stub(EmojiDataRetriever.prototype, 'getData').resolves(data);

			return parser.getFilteredData(version, false).should.eventually.deep.equal({
				version,
				Component: {
					'hair-style': [],
					'skin-tone': []
				}
			});
		});
	});
});
