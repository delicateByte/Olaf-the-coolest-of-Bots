import axios from 'axios';


class EmergencyNumbersConnector {

  /**
   * Returns the emergency numbers of the given countryCode as a dictionary 
   * @param countryCode The countryCode
   */
  async getEmergencyNumber(countryCode : string) : Promise<{}> {
    let response = null;
		try {
			response = await axios.get(`http://emergencynumberapi.com/api/country/${countryCode}`);
		} catch (error) {
			console.error(error);
			return null;
    }
    
    response = response.data.data;

    const emergencyNumbers = {};

    if (response.member_112 === true) emergencyNumbers['General'] = 112;
    if (response.ambulance.all[0] !== '') emergencyNumbers['Ambulance'] = +response.ambulance.all[0];
    if (response.police.all[0] !== '') emergencyNumbers['Police'] = +response.police.all[0];
    if (response.fire.all[0] !== '') emergencyNumbers['Fire'] = +response.fire.all[0];
    if (response.dispatch.all[0] !== '') emergencyNumbers['Dispatch'] = +response.dispatch.all[0];

		return emergencyNumbers;
  }
}


export default EmergencyNumbersConnector;