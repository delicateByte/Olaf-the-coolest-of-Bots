import * as dotenv from 'dotenv';
dotenv.config();

const NodeGeocoder = require('node-geocoder');



class GoogleGeocoderConnector {
	private geocoder;
	
	private geocoderOptions = {
		provider: 'google',

		// Optional depending on the providers
		httpAdapter: 'https', // Default
		apiKey: process.env.GOOGLE_KEY, // for Mapquest, OpenCage, Google Premier
		formatter: null, // 'gpx', 'string', ...
	}


  constructor() {
    this.geocoder = NodeGeocoder(this.geocoderOptions);
  }

	/**
	 * Gets the city name, country and country code of a location
	 * @param location The location (latitude, longitude) that needs to be translated into text.
	 */
  async getLocationName(latitude : Number, longitude : Number): Promise<string[]> {
		
		let response : string[] = ['', '', ''];

		await this.geocoder.reverse({ lat: latitude, lon: longitude }, (err, resLocation) => {
			response[0] = resLocation[0].city;
			response[1] = resLocation[0].country;
			response[2] = resLocation[0].countryCode;
		});

    return response;
  }
}

export default GoogleGeocoderConnector;