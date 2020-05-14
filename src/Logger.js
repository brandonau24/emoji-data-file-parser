export default class Logger {
	static exitLog(exitCode, message, error) {
		console.log(message);

		if (error) {
			console.log(error);
		}
		
		console.log('Exiting...');
		process.exit(exitCode);
	}
}
