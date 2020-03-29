import axios from 'axios';
import * as tempy from 'tempy';

import UnsplashImage from './unsplashImage';


class UnsplashConnector {
  private axios;

  constructor(accessToken: string) {
    this.axios = axios.create({
      baseURL: 'https://api.unsplash.com/',
      headers: { Authorization: `Client-ID ${accessToken}` },
    });
  }

  async getRandomImage(query: string = ''): Promise<UnsplashImage> {
    // Get a random featured photo matching the query
    const randomPhoto = await this.axios.get('/photos/random', {
      params: {
        featured: '',
        query,
      },
    });
    // Get all metadata for that photo
    const photoData = (await this.axios.get(`/photos/${randomPhoto.data.id}`)).data;

    let coordinates;
    if (!photoData.location.position.latitude) {
      coordinates = null;
    } else {
      coordinates = [photoData.location.position.latitude, photoData.location.position.longitude];
    }

    return new UnsplashImage(
      photoData.description || photoData.alt_description,
      photoData.links.html,
      photoData.urls.raw,
      photoData.user.name,
      photoData.tags.map((tag) => tag.title).filter((tag) => tag !== query),
      photoData.location.title,
      coordinates,
    );
  }

  async downloadImage(image: UnsplashImage): Promise<string> {
    // Calling the download endpoint is not necessary because this is not a user-triggered event
    // https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
    const response = await this.axios.get(image.imageUrl, {
      responseType: 'stream',
      params: {
        fm: 'png',
        crop: 'entropy',
        cs: 'tinysrgb',
        w: 1000,
        fit: 'max',
      },
    });

    return tempy.write(response.data, { extension: 'png' });
  }
}
export default UnsplashConnector;
