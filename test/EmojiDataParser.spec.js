import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import EmojiDataParser from '../src/EmojiDataParser.js';

const expect = chai.expect;

describe('parser', () => {
	let parser;

	beforeEach(() => {
		parser = new EmojiDataParser();
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('#creates', () => {
		it('emoji-data.json file', () => {
			const writeFileSpy = sinon.spy(fs, 'writeFile');

			parser.createFile();

			expect(writeFileSpy.calledOnceWith('emoji-data.json')).to.be.true;
		});

		it('checks permission to be able to create file in working directory', () => {
			const accessSpy = sinon.spy(fs, 'accessSync');

			parser.createFile();

			expect(accessSpy.calledOnceWith(process.cwd(), fs.constants.F_OK | fs.constants.W_OK)).to.be.true;
			expect(accessSpy.returnValues[0]).to.be.undefined;
		});
	});
});