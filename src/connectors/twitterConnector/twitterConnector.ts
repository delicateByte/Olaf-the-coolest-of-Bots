import * as Twitter from 'twitter';


class TwitterConnector {
  private TwitterClient;


  constructor() {
    this.TwitterClient = new Twitter({
      consumer_key: '',
      consumer_secret: '',
      access_token_key: '',
      access_token_secret: '',
    });
  }

  async getTwitterTrends() {
    this.TwitterClient.get('trends/place').then(async (trendsArray) => {
      const finalTrends = await this.formatTwitterTrendResults(trendsArray);
      console.log(finalTrends);
      return finalTrends;
    }).catch((err) => {
      console.log(err);
    });
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