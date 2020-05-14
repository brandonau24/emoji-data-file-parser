import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Logger from 'Logger';

chai.use(sinonChai);

describe('Logger', () => {
	describe('#exitLog', () => {
		let exitStub;
		let logStub;

		beforeEach(() => {
			exitStub = sinon.stub(process, 'exit');
			logStub = sinon.stub(console, 'log');
		});

		afterEach(() => {
			sinon.restore();
		});

		it('exits program and prints messages', () => {
			const exitCode = 1;
			const message = 'error message';

			Logger.exitLog(exitCode, message, {});

			exitStub.should.have.been.calledOnceWithExactly(exitCode);
			logStub.should.have.been.calledThrice;
			logStub.getCall(0).args[0].should.be.equal(message);
			logStub.getCall(1).args[0].should.be.deep.equal({});
			logStub.getCall(2).args[0].should.be.equal('Exiting...');
		});

		it('does not try to print error object if none is given', () => {
			const exitCode = 1;
			const message = 'error message';

			Logger.exitLog(exitCode, message);

			exitStub.should.have.been.calledOnceWithExactly(exitCode);
			logStub.should.have.been.calledTwice;
			logStub.getCall(0).args[0].should.be.equal(message);
			logStub.getCall(1).args[0].should.be.equal('Exiting...');
		});
	});
});
