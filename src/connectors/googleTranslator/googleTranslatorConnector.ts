import axios from 'axios';


class GoogleTranslatorConnector {
  private axios;

  constructor() {
    this.axios = axios.create({
      baseURL: `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TOKEN}`,
    });
  }

  /**
   * Translates given English text to the language of the given target country.
   * @param text English text that is to be translated.
   * @param targetCountryCode Represents the language to which the text should be translated.
  */
  async translate(text : string, targetCountryCode: string) {
    const response = await this.axios.get('', {
      params: {
        q: text,
        target: targetCountryCode,
        format: 'text',
      },
    });
    return response.data.data.translations[0].translatedText;
  }
}

export default GoogleTranslatorConnector;
