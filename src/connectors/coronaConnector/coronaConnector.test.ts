import axios from 'axios';
import CoronaConnector from './coronaConnector';

jest.mock('axios');

const mockResponseAxios = {

  country: 'Germany',
  latest_stat_by_country: [
    {
      id: '525788',
      country_name: 'Germany',
      total_cases: '101,779',
      new_cases: '1,656',
      active_cases: '71,415',
      total_deaths: '1,664',
      new_deaths: '80',
      total_recovered: '28,700',
      serious_critical: '3,936',
      region: null,
      total_cases_per1m: '1,215',
      record_date: '2020-04-06 19:40:01.923',
    },
  ],
};
const mockformated = {
  total_Cases_Ger: '101,779',
  new_Cases: '1,656',
  new_cases: '1,656',
  total_deaths: '1,664',
  new_deaths: '80',
  record_date: '2020-04-06 19:40:01.923',
};

function getMockConnector(response) : CoronaConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new CoronaConnector();
}

test('if formatting of Response is working', async () => expect(
  CoronaConnector.formatResults(mockResponseAxios),
).resolves.toEqual(mockformated));

test('if getting Corona data is working', async () => {
  expect(getMockConnector(mockResponseAxios).getCoronaData()).resolves.toEqual(mockformated);
});
