import axios from 'axios';

class TwitterConnector {
  axios;

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://api.twitter.com/1.1/trends/place.json',
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_OAUTH}`,
      },
    });
  }

  async getTwitterTrends() {
    return this.axios.get('', {
      params: {
        id: 698064,
      },
    }).then((res) => this.formatTwitterTrendResults(res.data)).catch((err) => { console.log(err); });
  }

  async formatTwitterTrendResults(unformattedTrends) {
    const formattedTrendArray = [];
    const preformattedTrendArray = await unformattedTrends[0].trends;
    await preformattedTrendArray.forEach((trendObject) => {
      formattedTrendArray.push(trendObject.name);
    });
    return formattedTrendArray;
  }
}
export default TwitterConnector;
