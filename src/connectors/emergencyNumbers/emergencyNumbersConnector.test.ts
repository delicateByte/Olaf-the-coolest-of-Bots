import axios from 'axios';
import EmergencyNumbersConnector from './emergencyNumbersConnector';


jest.mock('axios');


const mockResponseFR = {
  data: {
    ambulance: {
      all: ['15'],
      gsm: null,
      fixed: null,
    },
    fire: {
      all: ['18'],
      gsm: null,
      fixed: null,
    },
    police: {
      all: ['17'],
      gsm: null,
      fixed: null,
    },
    dispatch: {
      all: [''],
      gsm: null,
      fixed: null,
    },
    member_112: true,
    localOnly: false,
    nodata: false,
  },
};

const mockResponseUSA = {
  data: {
    ambulance: {
      all: [''],
      gsm: null,
      fixed: null,
    },
    fire: {
      all: [''],
      gsm: null,
      fixed: null,
    },
    police: {
      all: [''],
      gsm: null,
      fixed: null,
    },
    dispatch: {
      all: ['911'],
      gsm: null,
      fixed: null,
    },
    member_112: false,
    localOnly: false,
    nodata: false,
  },
};

/**
 * Returns a mock connector where axios requests are replaced by mocks
 * @param response
 */
function getMockConnector(response) {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new EmergencyNumbersConnector();
}


test('Get emergency numbers of France', async () => {
  const expected = {
    General: 112, Ambulance: 15, Police: 17, Fire: 18,
  };
  const mockConnector = getMockConnector(mockResponseFR);
  const actual = await mockConnector.getEmergencyNumber('FR');
  expect(actual).toEqual(expected);
});


test('Get emergency numbers of USA', async () => {
  const expected = { Dispatch: 911 };
  const mockConnector = getMockConnector(mockResponseUSA);
  const actual = await mockConnector.getEmergencyNumber('US');
  expect(actual).toEqual(expected);
});
