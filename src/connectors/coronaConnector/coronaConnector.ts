import axios from 'axios';


class CoronaConnector {
  private axios;
  constructor() {
    this.axios = axios.create({
      baseURL: 'https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php',
      headers: {
        'content-type': 'application/octet-stream',
        'x-rapidapi-host': process.env.CORONA_URL,
        'x-rapidapi-key': process.env.CORONA,
      },
    });
  }

  /** @function getCoronaData
   * Requests latest available Information on Corona Pandemic for Germany
   * @returns  beautified Information on the Corona Pandemic
   */
  async getCoronaData() {
    const apiResults = await this.axios.get('', {
      params: {
        country: 'Germany',
      },
    }).then((result) => result);
    return CoronaConnector.formatResults(apiResults.data);
  }

  /** @function formatResults
   * Requests latest available Information on Corona Pandemic for Germany
   * @param coronaInfo Information of a request to the RapidApi-CoronaAPI
   * @returns  beautified Information of the Input ( meant for Corona requests)
   */
  static async formatResults(coronaInfo) {
    return {
      total_Cases_Ger: coronaInfo.latest_stat_by_country[0].total_cases,
      new_Cases: coronaInfo.latest_stat_by_country[0].new_cases,
      new_cases: coronaInfo.latest_stat_by_country[0].new_cases,
      total_deaths: coronaInfo.latest_stat_by_country[0].total_deaths,
      new_deaths: coronaInfo.latest_stat_by_country[0].new_deaths,
      record_date: coronaInfo.latest_stat_by_country[0].record_date,
    };
  }
}
export default CoronaConnector;
