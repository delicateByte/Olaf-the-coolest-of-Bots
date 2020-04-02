import axios from 'axios';

class ExchangeratesConnector {
  private axios;
  private baseURL;

  constructor() {
    this.axios = axios;
    this.baseURL = 'https://api.exchangeratesapi.io';
  }
}
export default ExchangeratesConnector;
