import axios from 'axios';

class CoingeckoConnector {
  private axios;
  private baseURL;

  constructor() {
    this.axios = axios;
    this.baseURL = 'https://api.coingecko.com/api/v3';
  }
}
export default CoingeckoConnector;
