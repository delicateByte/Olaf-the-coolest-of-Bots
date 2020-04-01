import axios from 'axios';
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
    // TODO trigger photo.links.download_location on download to conform with API guidelines
    // https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download

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
      photoData.urls.full,
      photoData.user.name,
      photoData.tags.map((tag) => tag.title),
      photoData.location.title,
      coordinates,
    );
  }
}
export default UnsplashConnector;
