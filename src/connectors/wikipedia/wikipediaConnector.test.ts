import axios from 'axios';

import WikipediaConnector from './wikipediaConnector';


jest.mock('axios');

function getMockConnector(response) : WikipediaConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new WikipediaConnector();
}

test('search by page name', async () => {
  const searchResults = [
    {
      title: 'First Title',
      pageid: 12345,
      snippet: 'First search result',
    },
    {
      title: 'Second Title',
      pageid: 23456,
      snippet: 'Second search result may refer to',
    },
    {
      title: 'Third Title',
      pageid: 345678,
      snippet: 'Third search result',
    },
  ];

  // Second result should be omitted because it is a disambiguation page
  const expected = [['First Title', 12345], ['Third Title', 345678]];
  const actual = await getMockConnector({
    query: {
      search: searchResults,
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

test('get first paragraph of non-existing page', async () => {
  const actual = await getMockConnector({
    query: {
      pages: {
        '-1': {},
      },
    },
  }).getFirstParagraph('Non-existing Page');

  expect(actual).toBeNull();
});
