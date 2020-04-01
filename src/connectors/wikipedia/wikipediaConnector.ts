import axios from 'axios';

class WikipediaConnector {
  private axios;

  constructor() {
    this.axios = axios.create({
      baseURL: 'http://en.wikipedia.org/w/',
    });
  }

  async search(query: string): Promise<Array<number>> {
    const response = await this.axios.get('api.php', {
      params: {
        format: 'json',
        action: 'query',
        list: 'search',
        srsearch: query,
      },
    });

    const results = response.data.query.search;
    return results.map((result) => result.pageid);
  }

  async getFirstParagraph(page: number | string): Promise<string> {
    let params = {
      format: 'json',
      action: 'query',
      prop: 'extracts',
      exintro: '',
      explaintext: 1,
      redirects: 1,
    };

    if (typeof page === 'string') {
      params = Object.assign(params, { titles: page });
    } else {
      params = Object.assign(params, { pageids: page });
    }

    const response = await this.axios.get('api.php', { params });
    const { pages } = response.data.query;
    const pageId = Object.keys(pages)[0];

    if (pageId === '-1') {
      // Article does not exist
      return null;
    }

    return pages[pageId].extract.split('\n')[0];
  }
}
export default WikipediaConnector;
