import * as Weather from 'openweather-apis';

class OpenWeatherConnector {
  weather;
  constructor(lattitude :number, longitude : number) {
    this.weather = Weather;
    this.weather.setLang('de');
    this.weather.setCoordinate(lattitude, longitude);
    this.weather.setUnits('metric');
    this.weather.setAPPID(process.env.OPEN_WEATHER_API);
  }

  async resetLocation(lattitude:number, longitude:number) {
    this.weather.setCoordinate(lattitude, longitude);
    return new Promise(null);
  }

  getCurrentWeather() {
    this.weather.getAllWeather((err, JSONObj) => {
      console.log(this.extractRelevantInformation(JSONObj));
      return this.extractRelevantInformation(JSONObj);
    });
  }

  async extractRelevantInformation(weatherData:any) {
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
