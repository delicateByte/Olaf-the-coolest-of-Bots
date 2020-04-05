import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();


class GoogleKnowledgeBaseConnector {
	
	private knowledgeOptions = {
		host: 'https://kgsearch.googleapis.com',
		path: `v1/entities:search?key=${process.env.GOOGLE_KEY}&limit=1&types=City&types=Place`,
	};


	async getLocationDescription(city : String) : Promise<String> {

		// use google knowledge base to get short description of location
		let response;
		try {
			response = await axios.get(`${this.knowledgeOptions.host}/${this.knowledgeOptions.path}&query=${city}`);
		} catch (error) {
			console.error(error);
			return null;
		}

		response = response.data.itemListElement[0].result.detailedDescription.articleBody;

		return response;
	}

}

export default GoogleKnowledgeBaseConnector;