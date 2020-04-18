import axios from 'axios';


class NewsApiConnector {
  private axiosNewsInstance;

  constructor() {
    this.axiosNewsInstance = axios.create({
      baseURL: 'https://newsapi.org/v2',
      timeout: 10000,
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.NEWSAPI_KEY}` },
      responseType: 'json',
    });
  }

  // any because Mock would reauire full axios Response Mocking
  async getHeadlines(tags:string[]):Promise<any> {
    if (tags.length === 0) {
      return this.axiosNewsInstance.get('/top-headlines', {
        params: {
          country: 'de',
          category: 'politics',
        },
      }).then((axiosResponse) => axiosResponse.data).catch((err) => {
        console.log(err);
        return Promise.resolve({ articles: [{ title: 'ERROR IN TRANSMISSION' }] });
      });
    }
    return this.axiosNewsInstance.get('/top-headlines', {
      params: {
        country: 'de',
        q: tags,
      },
    }).then((axiosResponse) => axiosResponse.data).catch((err) => {
      console.log(err);
      return Promise.resolve({ articles: [{ title: 'ERROR IN TRANSMISSION' }] });
    });
  }
}
export default NewsApiConnector;
