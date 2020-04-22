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

  /** @function getHeadlines
   * Requests the latest News stories of german press (collected by NewsAPI.org)
   * @params tags Tags supplied in the Dashboard
   * @returns  unaltered data of the axios Request
   */
  async getHeadlines(tags:string[]):Promise<any> {
    if (tags.length === 0) {
      // Brach if no tags are supplied
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
    // Branch if tags are supplied
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
