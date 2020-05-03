import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import path from 'path';
import fs from 'fs';
import EmojiDataFileCreator from '../src/EmojiDataFileCreator.js';

chai.use(sinonChai);

describe('EmojiDataFileCreator', () => {
	let emojiDataFileCreator;

	beforeEach(() => {
		sinon.stub(console, 'log');
		
		emojiDataFileCreator = new EmojiDataFileCreator();
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('#createFile', () => {
		let writeFileStub;
	
		beforeEach(() => {
			writeFileStub = sinon.stub(fs, 'writeFile');
		});
	
		it('makes file after checking access to cwd', () => {
			const cwdStub = sinon.stub(process, 'cwd').returns('cwd');
	
			const customFileName = 'custom-name.json';
			emojiDataFileCreator.createFile(customFileName);
	
			writeFileStub.should.have.been.calledOnceWith(`${cwdStub()}${path.sep}${customFileName}`, '');
		});
	
		it('ends script when error occurs while writing file', () => {
			writeFileStub.yields(new Error());
	
			const exitStub = sinon.stub(process, 'exit');
	
			emojiDataFileCreator.createFile('emoji-data.json');
	
			exitStub.should.have.been.calledOnceWithExactly(1);
		});
	
		it('supports default file name of emoji-data.json', () => {
			const cwdStub = sinon.stub(process, 'cwd').returns('cwd');
	
			emojiDataFileCreator.createFile();
	
			writeFileStub.should.have.been.calledOnceWith(`${cwdStub}${path.sep}emoji-data.json`);
		});
	
		it('ends script when arg given is not a file name', () => {
			const exitStub = sinon.stub(process, 'exit');
			const parseSpy = sinon.spy(path, 'parse');
	
			const filePath = '/cwd/data.json';
	
			emojiDataFileCreator.createFile(filePath);
	
			parseSpy.should.have.been.calledWithExactly(filePath);
			parseSpy.returnValues[0].should.deep.equal({
				root: '/',
				dir: '/cwd',
				base: 'data.json',
				ext: '.json',
				name: 'data'
			});
	
			exitStub.should.have.been.calledOnceWithExactly(1);
		});
	});
});
