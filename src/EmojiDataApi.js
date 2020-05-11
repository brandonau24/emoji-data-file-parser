import axios from 'axios';

export default class EmojiDataApi {
	getData(version = '12.0') {
		if (Number.isNaN(parseFloat(version))) {
			return null;
		}

		const options = {
			headers: {
				Accept: 'text/plain',
				'Accept-Charset': 'utf-8'
			},
			responseType: 'text',
			responseEncoding: 'utf8'
		};

		console.log(`Getting emoji-test.txt v${version} file...`);

		return axios.get(`https://www.unicode.org/Public/emoji/${version}/emoji-test.txt`, options)
			.then(response => {
				return response.data;
			})
			.catch(error => {
				const { response, request, message } = error;

				if (response) {
					console.log(`Received response ${response.status}: ${response.statusText}`);
				}
				else if (request) {
					console.log(request);
				}
				else {
					console.log(message);
				}

				return null;
			});
	}
}
