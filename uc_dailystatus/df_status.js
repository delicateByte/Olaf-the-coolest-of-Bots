const fetch = require('node-fetch');

const urlInit = 'https://api.exchangeratesapi.io';
const headers = new fetch.Headers();

function fetchDataFrom(apiUrl) {
  const newRequest = fetch(apiUrl, {
    method: 'GET',
    headers,
  });
  return newRequest;
}

function checkStatusCode(rawResponse) {
  if (rawResponse.status === 200) {
    // console.log('Status is OK.');
    return Promise.resolve(rawResponse);
  } if (rawResponse.status === 404) {
    throw new Error('Content was not found.');
  } else {
    throw new Error(`Error occured - status: ${rawResponse.status}`);
  }
}

function parseToJSON(rawResponse) {
  return rawResponse.json();
}

exports.urlInit = urlInit;
exports.fetchDataFrom = fetchDataFrom;
exports.checkStatusCode = checkStatusCode;
exports.parseToJSON = parseToJSON;

fetchDataFrom(`${urlInit}/latest`)
  .then((receivedResponse) => checkStatusCode(receivedResponse))
  .then((checkedResponse) => parseToJSON(checkedResponse))
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
