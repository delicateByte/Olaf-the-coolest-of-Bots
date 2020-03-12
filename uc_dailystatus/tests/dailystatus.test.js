const dfStatus = require('../df_status');
const mockResults = require('./mock_results');

test('get JSON response for results of 09th March 2020', () => dfStatus.fetchDataFrom(`${dfStatus.urlInit}/2020-03-09`)
  .then((data) => dfStatus.parseToJSON(data))
  .then((result) => expect(result).toStrictEqual(mockResults.ratesDefault2020March09)));
