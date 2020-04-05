import GoogleKnowledgeBaseConnector from './googleKnowledgeBaseConnector';


function getMockConnector() {
  return new GoogleKnowledgeBaseConnector();
}


test('Get location info from exemplary city name', async () => {
  const mockConnector = getMockConnector();
  const actual = await mockConnector.getLocationDescription('Paris');
  expect(typeof(actual)).toEqual(typeof(""));
});