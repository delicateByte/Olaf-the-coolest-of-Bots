import axios from 'axios';
import * as tempy from 'tempy';

export default class GoogleMapsStaticConnector {
  private accessToken;

  private axios;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.axios = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api/staticmap',
      responseType: 'stream',
    });
  }

  async getMapImage(location: [number, number] | string): Promise<string> {
    let locationString;
    if (typeof location === 'string') {
      locationString = location;
    } else {
      locationString = `${location[0]},${location[1]}`;
    }

    const response = await this.axios.get('', {
      params: {
        center: locationString,
        markers: locationString,
        zoom: 10,
        size: '500x500',
        scale: 2,
        maptype: 'hybrid',
        key: this.accessToken,
      },
    });

    return tempy.write(response.data, { extension: 'png' });
  }
}
