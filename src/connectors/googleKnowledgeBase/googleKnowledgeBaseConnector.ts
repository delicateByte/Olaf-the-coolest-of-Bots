import axios from 'axios';


class GoogleKnowledgeBaseConnector {
  private axios;
  private knowledgeOptions = {
    host: 'https://kgsearch.googleapis.com',
    path: `v1/entities:search?key=${process.env.GOOGLE_KEY}&limit=1&types=City&types=Place`,
  };

  constructor() {
    this.axios = axios.create({
      baseURL: `${this.knowledgeOptions.host}/${this.knowledgeOptions.path}&query=`,
    });
  }


  async getLocationDescription(city : string) : Promise<string> {
    // use google knowledge base to get short description of location
    let response : any;
    try {
      response = await this.axios.get(city);
    } catch (error) {
      console.error(error);
      return null;
    }

    response = response.data.itemListElement[0].result.detailedDescription.articleBody;

    return response;
  }
}

export default GoogleKnowledgeBaseConnector;
