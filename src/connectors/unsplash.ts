import axios from 'axios';

export interface UnsplashConnector {
  getRandomImage() : Promise<string>;
}

export class UnsplashConnectorImplementation implements UnsplashConnector {

  private axios;

  constructor(accessToken: string) {
    this.axios = axios.create({
      baseURL: 'https://api.unsplash.com/',
      headers: { Authorization: `Client-ID ${accessToken}` },
    });
  }

  async getRandomImage(): Promise<string> {
    const response = await this.axios.get('https://api.unsplash.com/photos/random');
    return response.data.urls.regular;
  }
}
