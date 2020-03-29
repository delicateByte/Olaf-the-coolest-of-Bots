import Axios from 'axios';

export default class ChuckNorris {
  static async getJoke() {
    const joke = await Axios.get('http://api.icndb.com/jokes/random').then((res) => res.data.value.joke).catch((err) => {
      console.log(err);
      return 'Chuck Norris was not unable to find a jo... fact, the API failed to deliver one to you.';
    });

    return joke;
  }
}
