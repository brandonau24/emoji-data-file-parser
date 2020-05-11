import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Logger from 'Logger';

chai.use(sinonChai);

describe('Logger', () => {
	describe('#exitLog', () => {
		it('exits program and prints messages', () => {
			const exitStub = sinon.stub(process, 'exit');
			const logStub = sinon.stub(console, 'log');

			const exitCode = 1;
			const message = 'error message';

			Logger.exitLog(exitCode, message, {});

			exitStub.should.have.been.calledOnceWithExactly(exitCode);
			logStub.should.have.been.calledThrice;
			logStub.getCall(0).args[0].should.be.equal(message);
			logStub.getCall(1).args[0].should.be.deep.equal({});
			logStub.getCall(2).args[0].should.be.equal('Exiting...');

			exitStub.restore();
			logStub.restore();
		});
	});
});
