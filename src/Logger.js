export default class Logger {
	static exitLog(exitCode, message, error) {
		console.log(message);
		console.log(error);
		console.log('Exiting...');
		process.exit(exitCode);
	}
}
