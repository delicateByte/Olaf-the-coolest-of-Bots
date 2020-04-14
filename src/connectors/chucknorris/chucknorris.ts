import Axios from 'axios';

export default class ChuckNorris {
  static async getJoke() {
    const joke = await Axios.get('http://api.icndb.com/jokes/random').then((res) => ({ joke: res.data.value.joke })).catch((err) => {
      console.log(err);
      return { joke: 'Chuck Norris was not unable to make up a joke, the API failed to deliver one to you.' };
    });

    return joke;
  }
}
