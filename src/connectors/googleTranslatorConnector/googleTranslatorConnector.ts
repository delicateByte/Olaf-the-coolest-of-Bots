import * as dotenv from 'dotenv';
import { resolve } from 'dns';
import { rejects } from 'assert';
dotenv.config();

const googleTranslate = require('google-translate');


class GoogleTranslatorConnector {
  private translator;

  constructor() {
    this.translator = googleTranslate(process.env.GOOGLE_KEY);
  }
  
  async translate(text : String, sourceCountryCode : String) : Promise<String> {
    return new Promise((resolve, reject) => {  
      this.translator.translate(text, sourceCountryCode, 'en', (err, translation) => {
        if (err) {
          resolve(null)
        } else {
          const response = translation.translatedText;
          resolve(response);
        }
      });
    });
  }

}

export default GoogleTranslatorConnector;