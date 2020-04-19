import axios from 'axios';


class EmergencyNumbersConnector {
  private axios;

  constructor() {
    this.axios = axios.create({
      baseURL: 'http://emergencynumberapi.com/api/country/',
    });
  }

  /**
   * Returns the emergency numbers of the given countryCode as a dictionary
   * @param countryCode The countryCode
   */
  async getEmergencyNumber(countryCode : string) : Promise<{}> {
    let response = null;
    try {
      response = await this.axios.get(countryCode);
    } catch (error) {
      console.error(error);
      return null;
    }

    response = response.data.data;

    const emergencyNumbers = {};

    if (response.member_112 === true) emergencyNumbers['General'] = 112; // eslint-disable-line dot-notation
    if (response.ambulance.all[0] !== '') emergencyNumbers['Ambulance'] = +response.ambulance.all[0]; // eslint-disable-line dot-notation
    if (response.police.all[0] !== '') emergencyNumbers['Police'] = +response.police.all[0]; // eslint-disable-line dot-notation
    if (response.fire.all[0] !== '') emergencyNumbers['Fire'] = +response.fire.all[0]; // eslint-disable-line dot-notation
    if (response.dispatch.all[0] !== '') emergencyNumbers['Dispatch'] = +response.dispatch.all[0]; // eslint-disable-line dot-notation

    return emergencyNumbers;
  }
}


export default EmergencyNumbersConnector;
