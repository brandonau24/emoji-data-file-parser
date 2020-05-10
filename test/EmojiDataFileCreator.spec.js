import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import path from 'path';
import fs from 'fs';
import EmojiDataFileCreator from 'EmojiDataFileCreator';
import EmojiDataParser from 'EmojiDataParser';

chai.use(sinonChai);

describe('EmojiDataFileCreator', () => {
	let emojiDataFileCreator;

	beforeEach(() => {
		sinon.stub(console, 'log');
		sinon.stub(EmojiDataParser.prototype, 'getFilteredData').resolves({});

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
	
		it('makes file after checking access to cwd', async () => {
			const cwdStub = sinon.stub(process, 'cwd').returns('cwd');
	
			const customFileName = 'custom-name.json';
			await emojiDataFileCreator.createFile(customFileName);
	
			writeFileStub.should.have.been.calledOnceWith(`${cwdStub()}${path.sep}${customFileName}`);
		});
	
		it('ends script when error occurs while writing file', async () => {
			writeFileStub.yields(new Error());
	
			const exitStub = sinon.stub(process, 'exit');
	
			await emojiDataFileCreator.createFile('emoji-data.json');
	
			exitStub.should.have.been.calledOnceWithExactly(1);
		});
	
		it('supports default file name of emoji-data.json', async () => {
			const cwdStub = sinon.stub(process, 'cwd').returns('cwd');
	
			await emojiDataFileCreator.createFile();
	
			writeFileStub.should.have.been.calledOnceWith(`${cwdStub}${path.sep}emoji-data.json`);
		});
	
		it('ends script when arg given is not a file name', async () => {
			const exitStub = sinon.stub(process, 'exit');
			const parseSpy = sinon.spy(path, 'parse');
	
			const filePath = '/cwd/data.json';
	
			await emojiDataFileCreator.createFile(filePath);
	
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

		it('writes JSON data to file', async () => {
			const stringifyStub = sinon.stub(JSON, 'stringify');

			const data = {
				group: [
					{
						codepoints: '1F600',
						name: 'grinning face'
					}
				]
			};
			
			EmojiDataParser.prototype.getFilteredData.restore();
			sinon.stub(EmojiDataParser.prototype, 'getFilteredData').resolves(data);

			await emojiDataFileCreator.createFile();

			stringifyStub.should.have.been.calledOnceWithExactly(data);
		});

		it('does not create file when data is null or undefined', async () => {
			sinon.stub(process, 'exit');

			EmojiDataParser.prototype.getFilteredData.restore();
			sinon.stub(EmojiDataParser.prototype, 'getFilteredData').resolves(null);

			await emojiDataFileCreator.createFile();

			writeFileStub.should.not.have.been.called;
		});
	});
});
