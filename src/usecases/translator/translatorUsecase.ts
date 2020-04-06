import UseCase from "../../interfaces/useCase";
import UseCaseResponse from "../../classes/UseCaseResponse";
import TextResponse from '../../classes/TextResponse';

import GoogleGeocoderConnector from "../../connectors/googleGeocoder/googleGeocoderConnector";


import ProcessedTelegramMessage from "../../classes/ProcessedTelegramMessage"
import EmergencyNumbersConnector from "../../connectors/emergencyNumbers/emergencyNumbersConnector";
import GoogleKnowledgeBaseConnector from "../../connectors/googleKnowledgeBase/googleKnowledgeBaseConnector";
import EndUseCaseResponse from "../../classes/EndUseCaseResponse";
import GoogleTranslatorConnector from "../../connectors/googleTranslatorConnector/googleTranslatorConnector";


class TranslatorUsecase implements UseCase {
  
  name: string = 'Translator';
  triggers: string[] = []; // this use case is be triggered by a location, not by trigger words.

  private googleGeocoderConnector : GoogleGeocoderConnector;
  private emergencyNumbersConnector: EmergencyNumbersConnector;
  private googleKnowledgeBaseConnector: GoogleKnowledgeBaseConnector;
  private googleTranslatorConnector: GoogleTranslatorConnector;

  constructor() {
    this.googleGeocoderConnector = new GoogleGeocoderConnector();
    this.emergencyNumbersConnector = new EmergencyNumbersConnector();
    this.googleKnowledgeBaseConnector = new GoogleKnowledgeBaseConnector();
    this.googleTranslatorConnector = new GoogleTranslatorConnector();
  }

  private countryCode : string = null;


  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse, any, unknown> {
    if (message.originalMessage.location) {
      const locationInfo = await this.googleGeocoderConnector.getLocationName(message.latitude, message.longitude);
      const city : string = locationInfo[0];
      const country  : string = locationInfo[1];
      this.countryCode = locationInfo[2];

      let response : string = `You're located in ${city}, ${country}.`;
      response += await this.getEmergencyInfo(this.countryCode);
      
      yield new TextResponse(response);

      const locationDescription = await this.googleKnowledgeBaseConnector.getLocationDescription(city);
      yield new TextResponse(locationDescription);

      yield new TextResponse('Your following (English) messages will be translated to the language of your location. To stop the translator, please type "!STOP" (without quotes).')
    
    } else {
      if (message.text === '!STOP') {
        return new EndUseCaseResponse();
      } else {
        if (this.countryCode === null) {
          // This should never happen, but just in case ... ;-)
          yield new TextResponse('Please let me know where you are by sending your location.');
        } else {
          const translation : string = await this.googleTranslatorConnector.translate(message.text, this.countryCode);
          yield new TextResponse(translation);
        }
      }
    }


    return null;
  }

  reset(): void {
    this.countryCode = null;
  }


  private async getEmergencyInfo(countryCode : string) : Promise<string> {
    const emergencyNumbers : {} = await this.emergencyNumbersConnector.getEmergencyNumber(countryCode);
    const emergencyKeys = Object.keys(emergencyNumbers);
    
    let response : string = ''

    if (emergencyKeys.length === 0) {
      // do nothing
    } else if (emergencyKeys.length === 1) {
      response += ' In case of emergency, call ${emergencyNumbers[emergencyKeys[0]]} (${emergencyKeys[0]}).';
    } else if (emergencyKeys.length === 2) {
      response += ' In case of emergency, call ';
      response += `${emergencyNumbers[emergencyKeys[0]]} (${emergencyKeys[0]})`;
      response += ` or ${emergencyNumbers[emergencyKeys[1]]} (${emergencyKeys[1]}).`
    } else {
      response += ' In case of emergency, call ';
      for (let i = 0; i<emergencyKeys.length; i++) {
        if (i < emergencyKeys.length-1) {
          response += `${emergencyNumbers[emergencyKeys[i]]} (${emergencyKeys[i]}), `;
        } else {
          response += `or ${emergencyNumbers[emergencyKeys[i]]} (${emergencyKeys[i]})`;
        }
      }
    }

    return response;
  }

}

export default TranslatorUsecase;



// Old code
/**
// check if the message contains a location
  if (msg.location) {
    // use google geocoder to reverse-search the location's city and country
    geocoder.reverse({ lat: msg.location.latitude, lon: msg.location.longitude },
      (err, resLocation) => {
        city = resLocation[0].city;
        country = resLocation[0].country;
        countryCode = resLocation[0].countryCode;

        // send a message to the user containing city and country
        telegramBot.sendMessage(chatId, `You're located in ${city}, ${country}.`);

        // get emergency numbers
        let phone = '';
        http.get(`http://emergencynumberapi.com/api/country/${countryCode}`, (resNumber) => {
          resNumber.setEncoding('utf8');

          resNumber.on('data', (chunk) => {
            phone += chunk;
          });

          resNumber.on('end', () => {
            const emergency = JSON.parse(phone);

            const phoneArray = [];

            if (emergency.data.member_112 === true) {
              phoneArray.push('112 (general)');
            }
            if (emergency.data.ambulance.all[0] !== '') {
              phoneArray.push(`${emergency.data.ambulance.all[0]} (ambulance)`);
            }

            if (emergency.data.police.all[0] !== '') {
              phoneArray.push(`${emergency.data.police.all[0]} (police)`);
            }

            if (emergency.data.fire.all[0] !== '') {
              phoneArray.push(`${emergency.data.fire.all[0]} (fire)`);
            }

            let emergencyStr = '';

            if (phoneArray.length === 0) {
              // do nothing
            } else if (phoneArray.length === 1) {
              emergencyStr += `In case of emergency, call ${phoneArray[0]}.`;
            } else {
              emergencyStr += 'In case of emergency, call ';
              phoneArray.forEach((element) => {
                if (element !== phoneArray.slice(-1)[0]) {
                  emergencyStr += (`${element}, `);
                } else {
                  emergencyStr += (`or ${element}.`);
                }
              });
            }

            telegramBot.sendMessage(chatId, emergencyStr);
          });
        });

        // use google knowledge base to get short description of location
        googleKnowledgeOptions.path += (`&query=${city}`);
        let info = '';
        https.get(googleKnowledgeOptions, (resInfo) => {
          resInfo.setEncoding('utf8');
          resInfo.on('data', (chunk) => {
            info += chunk;
          });

          resInfo.on('end', () => {
            info = JSON.parse(info).itemListElement[0].result.detailedDescription.articleBody;
            // send short description to user
            telegramBot.sendMessage(chatId, info);
          });
        });
      });
  }

  // send a message to the chat acknowledging receipt of their message
  // telegramBot.sendMessage(chatId, 'Received your message');
});

 */