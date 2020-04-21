import * as NodeGeocoder from 'node-geocoder';

class GoogleGeocoderConnector {
  geocoder;

  private geocoderOptions = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: process.env.GOOGLE_TOKEN, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
  };


  constructor() {
    this.geocoder = NodeGeocoder(this.geocoderOptions);
  }


  /**
   * Gets the city name, country and country code of a location
   * @param location The location (latitude, longitude) that needs to be translated into text.
   */
  async getLocationName(latitude : Number, longitude : Number): Promise<string[]> {
    let locationName = ['', '', ''];
    await this.geocoder.reverse({ lat: latitude, lon: longitude }, (err, resLocation) => {
      locationName = GoogleGeocoderConnector.formatResponse(resLocation);
    });
    return locationName;
  }

  static formatResponse(response) : string[] {
    const locationName = ['', '', ''];
    locationName[0] = response[0].city;
    locationName[1] = response[0].country;
    locationName[2] = response[0].countryCode;
    return locationName;
  }

  getGeocoderOptions() : {} {
    return this.geocoderOptions;
  }
}

export default GoogleGeocoderConnector;
