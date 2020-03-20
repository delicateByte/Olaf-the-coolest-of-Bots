import axios from 'axios';
import UnsplashImage from './unsplashImage';

export default class UnsplashConnector {
  private axios;

  constructor(accessToken: string) {
    this.axios = axios.create({
      baseURL: 'https://api.unsplash.com/',
      headers: { Authorization: `Client-ID ${accessToken}` },
    });
  }

  async getRandomImage(): Promise<UnsplashImage> {
    const randomPhoto = await this.axios.get('https://api.unsplash.com/photos/random?featured');
    const photoData = (await this.axios.get(`https://api.unsplash.com/photos/${randomPhoto.data.id}`)).data;

    const tags = photoData.tags.map((tag) => tag.title);
    let location;
    if (!photoData.location.position.latitude) {
      location = null;
    } else {
      location = [photoData.location.position.latitude, photoData.location.position.longitude];
    }

    return new UnsplashImage(photoData.links.html, photoData.urls.full, photoData.user.name,
      tags, location);

    // TODO trigger photo.links.download_location on download
  }
}
