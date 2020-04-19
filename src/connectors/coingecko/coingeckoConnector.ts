import axios from 'axios';
import CoingeckoResponse from './coingeckoResponse';

class CoingeckoConnector {
  private axios;

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
    });
  }

  async getCurrentStatus(path: string): Promise<CoingeckoResponse> {
    // const values = await this.axios.get('/simple/price?ids=bitcoin&vs_currencies=eur');
    const values = await this.axios.get(path);
    return new CoingeckoResponse(
      values.data.bitcoin.eur,
    );
  }
}
export default CoingeckoConnector;
