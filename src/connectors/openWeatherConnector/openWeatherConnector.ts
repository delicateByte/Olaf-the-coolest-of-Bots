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

  resetLocation(lattitude:number, longitude:number) {
    this.weather.setCoordinate(lattitude, longitude);
  }

  async getCurrentWeather(callback) {
    let a ={};
    await this.weather.getAllWeather(async (err, JSONObj)=>{
      callback( await this.extractRelevantInformation(JSONObj));
    });
  }

   extractRelevantInformation(weatherData:any) {

    const a = {
      position: weatherData.coord,
      tempretures_from: weatherData.main.temp_min,
      tempreatures_up_to: weatherData.main.temp_max,
      weatherDescription: {
        mostly: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
      },

    };
    return a;
  }
}
export default OpenWeatherConnector;
