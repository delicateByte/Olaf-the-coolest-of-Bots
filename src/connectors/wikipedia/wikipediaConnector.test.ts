import axios from 'axios';
import WikipediaConnector from './wikipediaConnector';

jest.mock('axios');

function getMockConnector(returnValue) : WikipediaConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: returnValue }),
  });
  return new WikipediaConnector();
}

test('search', async () => {
  const expected = [12345, 23456, 345678];
  const actual = await getMockConnector({
    query: {
      search: expected.map((id) => ({ pageid: id })),
    },
  }).search('my query');

  expect(actual).toEqual(expected);
});

test('get first paragraph by title', async () => {
  const expected = 'This is the first paragraph.';
  const actual = await getMockConnector({
    query: {
      pages: {
        12345: {
          extract: `${expected}\nThis should not be returned.`,
        },
      },
    },
  }).getFirstParagraph('Page Title');

  expect(actual).toEqual(expected);
});

test('get first paragraph by page id', async () => {
  const expected = 'This is the first paragraph.';
  const actual = await getMockConnector({
    query: {
      pages: {
        12345: {
          extract: `${expected}\nThis should not be returned.`,
        },
      },
    },
  }).getFirstParagraph(12345);

  expect(actual).toEqual(expected);
});
