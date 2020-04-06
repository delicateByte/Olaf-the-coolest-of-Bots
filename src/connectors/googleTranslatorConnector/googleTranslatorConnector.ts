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
  
  /**
   * Translates given English text to the language of the given target country.
   * @param text English text that is to be translated.
   * @param targetCountryCode Represents the language to which the text should be translated.
   */
  async translate(text : string, targetCountryCode : string) : Promise<string> {
    return new Promise((resolve, reject) => {  
      this.translator.translate(text, 'en', targetCountryCode, (err, translation) => {
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