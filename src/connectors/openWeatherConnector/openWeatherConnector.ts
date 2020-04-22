import axios from 'axios';

class OpenWeatherConnector {
  axios;
  position={
    lat: undefined,
    long: undefined,
  };

  constructor(lattitude :number, longitude : number) {
    this.axios = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5/weather',

    });
    this.position.lat = lattitude;
    this.position.long = longitude;
  }

  /** @function resetLocation
   * setzt aktuelle position in der Instaz
   * @param lattitude Längengrad
   * @param longitude Breitengrad
   */
  resetLocation(lattitude:number, longitude:number) {
    this.position.lat = lattitude;
    this.position.long = longitude;
  }

  /** @function getCurrentWeather
   * Requests latest available local weather forecast (next 3 hours)
   * @returns  beautified Information on the Weather forcast
   */
  async getCurrentWeather() {
    const openWeatherAPIResponse = await this.axios.get('', {
      params: {
        units: 'metric',
        lang: 'en',
        appid: process.env.OPEN_WEATHER_API,
        lat: this.position.lat,
        lon: this.position.long,
      },

    }).then((weatherResponse) => weatherResponse).catch((err) => { console.log(err); throw err; });
    return OpenWeatherConnector.extractRelevantInformation(openWeatherAPIResponse.data);
  }

  /** @function extractRelevantInformation
   * Extracts / beautifies Weather API response
   * @param weatherData WeatherAPI Response
   * @returns  beautified Weather forecast
   */
  static extractRelevantInformation(weatherData:any) {
    return {
      position: weatherData.coord,
      tempretures_from: weatherData.main.temp_min,
      tempreatures_up_to: weatherData.main.temp_max,
      weatherDescription: {
        mostly: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
      },

    };
  }
}
export default OpenWeatherConnector;
