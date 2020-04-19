const sinon = require('sinon');
const expect = require('chai').expect;

const https = require('https');
const fs = require('fs')

describe('parse.js', () => {
	beforeEach(() => {
		require('./parse.js')
	});

	afterEach(() => {
		fs.unlink('./emoji-data.json', error => {

		});
	});

	it('creates emoji-data.json file', () => {
		fs.access('./emoji-data.json', fs.constants.F_OK, error => {
			expect(error).to.be.null;
		});
	});
});