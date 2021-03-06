import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import path from 'path';
import fs from 'fs';
import EmojiDataFileCreator from 'EmojiDataFileCreator';
import EmojiDataParser from 'EmojiDataParser';
import Logger from 'Logger';

chai.use(sinonChai);

describe('EmojiDataFileCreator', () => {
	let emojiDataFileCreator;
	let exitLogStub;
	let getFilteredDataStub;

	beforeEach(() => {
		exitLogStub = sinon.stub(Logger, 'exitLog');
		getFilteredDataStub = sinon.stub(EmojiDataParser.prototype, 'getFilteredData').resolves({});

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
			const filePath = path.join(process.cwd(), 'emoji-data.json');
			const error = new Error();

			writeFileStub.yields(error);
	
			await emojiDataFileCreator.createFile('emoji-data.json');

			exitLogStub.should.have.been.calledOnceWithExactly(1, `Cannot create/write ${filePath}...`, error);
		});
	
		it('supports default file name of emoji-data.json', async () => {
			const cwdStub = sinon.stub(process, 'cwd').returns('cwd');
	
			await emojiDataFileCreator.createFile();
	
			writeFileStub.should.have.been.calledOnceWith(`${cwdStub}${path.sep}emoji-data.json`);
		});
	
		it('ends script when arg given is not a file name', async () => {
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
	
			exitLogStub.should.have.been.calledOnceWithExactly(1, `The provided name ${filePath} is a path or a file name including a path. This program only supports creating the file in the current working directory (the directory this script was ran in).`);
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
			EmojiDataParser.prototype.getFilteredData.restore();
			sinon.stub(EmojiDataParser.prototype, 'getFilteredData').resolves(null);

			await emojiDataFileCreator.createFile();

			writeFileStub.should.not.have.been.called;
			exitLogStub.should.have.been.calledOnceWithExactly(1, 'No data was returned...');
		});

		it('passes version number to data parser', () => {
			const version = '13.0';

			emojiDataFileCreator.createFile('emoji-data.json', version, false);

			getFilteredDataStub.should.have.been.calledOnceWithExactly(version, false);
		});
		
		it('passes removeModifier flag to data parser', () => {
			const removeModifiers = true;

			emojiDataFileCreator.createFile('emoji-data.json', '13.0', removeModifiers);

			getFilteredDataStub.should.have.been.calledOnceWithExactly('13.0', removeModifiers);
		});
	});
});
