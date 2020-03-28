import Axios from 'axios';

export default class ChuckNorris {
  static async getJoke() {
    const jokeJson = await Axios.get('http://api.icndb.com/jokes/random').then((res) => res.data.value);

    console.log(jokeJson);

    return jokeJson.joke;
  }
}
