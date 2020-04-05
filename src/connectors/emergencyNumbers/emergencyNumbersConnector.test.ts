import EmergencyNumbersConnector from './emergencyNumbersConnector';


function getMockConnector() {
  return new EmergencyNumbersConnector();
}


test('Get exemplary emergency numbers of France', async () => {
  const expected = {'General' : 112, 'Ambulance' : 15,  'Police': 17, 'Fire': 18};
  const mockConnector = getMockConnector();
  const actual = await mockConnector.getEmergencyNumber('FR');
  expect(actual).toEqual(expected);
});

test('Get exemplary emergency numbers of USA', async () => {
  const expected = {'Dispatch' : 911};
  const mockConnector = getMockConnector();
  const actual = await mockConnector.getEmergencyNumber('US');
  expect(actual).toEqual(expected);
});