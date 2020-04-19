import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import EmojiDataParser from '../src/EmojiDataParser.js';

const expect = chai.expect;

describe('parser', () => {
	it('creates emoji-data.json file', () => {
		const writeFileSpy = sinon.spy(fs, 'writeFile');
		const parser = new EmojiDataParser();
		parser.createFile();

		expect(writeFileSpy.calledOnceWith('emoji-data.json')).to.be.true;
	});
});