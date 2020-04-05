import UseCase from "../../interfaces/useCase";
import UseCaseResponse from "../../classes/UseCaseResponse";

import GoogleGeocoderConnector from "../../connectors/googleGeocoder/googleGeocoderConnector";


import ProcessedTelegramMessage from "../../classes/ProcessedTelegramMessage"


class TranslatorUsecase implements UseCase {
  
  name: string;
  triggers: string[];


  receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse, any, unknown> {
    throw new Error("Method not implemented.");
  }

  reset(): void {
    throw new Error("Method not implemented.");
  }

}

/**
private getLocationString(locInfo : String[]) : String {
  return `You're located in ${locInfo[0]}, ${locInfo[1]}.`
}
*/

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