import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs';
import EmojiDataParser from '../src/EmojiDataParser.js';

chai.should();
chai.use(sinonChai)

describe('parser', () => {
	let parser;

	beforeEach(() => {
		parser = new EmojiDataParser();
		sinon.stub(console, 'log');
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('#creates', () => {
		it('emoji-data.json file', () => {
			const writeFileSpy = sinon.spy(fs, 'writeFileSync');

			parser.createFile();

			writeFileSpy.should.have.been.calledOnceWith('emoji-data.json');
			writeFileSpy.should.have.returned(undefined);
		});

		it('checks permission to be able to create file in working directory', () => {
			const accessSpy = sinon.spy(fs, 'accessSync');

			parser.createFile();

			accessSpy.should.have.been.calledOnceWith(process.cwd(), fs.constants.F_OK | fs.constants.W_OK);
			accessSpy.should.have.returned(undefined);
		});

		it('ends script when an error occurs checking permission', () => {
			sinon.stub(fs, 'accessSync').throws();
			const exitStub = sinon.stub(process, 'exit');

			parser.createFile();

			exitStub.should.have.been.calledOnceWith(1);
		});
	});
});
