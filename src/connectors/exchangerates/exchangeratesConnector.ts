import axios from 'axios';
import ExchangeratesResponse from './exchangeratesResponse';

class ExchangeratesConnector {
  private axios;
  private currencies = ['USD', 'JPY', 'GBP', 'CHF'];

  constructor() {
    this.axios = axios.create({
      baseURL: 'https://api.exchangeratesapi.io/',
    });
  }

  async getCurrentStatus(): Promise<ExchangeratesResponse> {
    const values = await this.axios.get('/latest');
    return new ExchangeratesResponse(
      values.data.rates,
      values.data.base,
      values.data.date,
    );
  }

  async getCurrencies(allCurrencies: ExchangeratesResponse) {
    const result = {};
    Object.keys(allCurrencies.rates).forEach((key) => {
      if (this.currencies.includes(key)) {
        result[key] = allCurrencies.rates[key];
      }
    });
    return result;
  }
}
export default ExchangeratesConnector;
