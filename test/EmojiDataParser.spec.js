import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fs from 'fs';
import path from 'path';
import EmojiDataParser from '../src/EmojiDataParser.js';

chai.should();
chai.use(sinonChai);

describe('parser', () => {
	let parser;

	beforeEach(() => {
		parser = new EmojiDataParser();
		sinon.stub(console, 'log');
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('#createFile', () => {
		let writeFileStub;
		let accessStub;

		beforeEach(() => {
			writeFileStub = sinon.stub(fs, 'writeFileSync');
			accessStub = sinon.stub(fs, 'accessSync');
		});

		it('with user provided name in cwd', () => {
			const joinSpy = sinon.spy(path, 'join');

			const cwdProcessStub = sinon.stub(process, 'cwd').returns('cwd');

			const fileName = 'custom-file.txt';
			
			parser = new EmojiDataParser(fileName);
			parser.createFile();

			joinSpy.should.have.been.calledOnceWith(cwdProcessStub(), fileName);
			joinSpy.should.have.returned(`${cwdProcessStub()}${path.sep}${fileName}`);
			writeFileStub.should.have.been.calledOnceWith(joinSpy.returnValues[0]);
			writeFileStub.should.have.returned(undefined);
		});
		
		it('with default name in cwd', () => {
			const joinSpy = sinon.spy(path, 'join');

			const cwdProcessStub = sinon.stub(process, 'cwd').returns('cwd');

			parser = new EmojiDataParser();
			parser.createFile();

			joinSpy.should.have.been.calledOnceWith(cwdProcessStub(), 'emoji-data.json');
			joinSpy.should.have.returned(`${cwdProcessStub()}${path.sep}emoji-data.json`);
			writeFileStub.should.have.been.calledOnceWith(joinSpy.returnValues[0]);
			writeFileStub.should.have.returned(undefined);
		});

		it('ends script when file name given is not a file name', () => {
			sinon.stub(path, 'parse').returns({
				root: '/',
				dir: 'dir',
				base: 'data.json',
				ext: '.json',
				name: 'data'
			});

			const exitStub = sinon.stub(process, 'exit');

			parser.createFile();

			exitStub.should.have.been.calledOnceWith(1);
		});

		it('checks permission to be able to create file in working directory', () => {
			parser.createFile();

			accessStub.should.have.been.calledOnceWith(process.cwd(), fs.constants.F_OK | fs.constants.W_OK);
			accessStub.should.have.returned(undefined);
		});

		it('ends script when an error occurs checking permission', () => {
			accessStub.restore(); 

			sinon.stub(fs, 'accessSync').throws();
			const exitStub = sinon.stub(process, 'exit');

			parser.createFile();

			exitStub.should.have.been.calledOnceWith(1);
		});
	});
});
