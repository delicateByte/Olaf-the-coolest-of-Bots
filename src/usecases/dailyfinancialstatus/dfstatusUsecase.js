"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
exports.__esModule = true;
var TextResponse_1 = require("../../classes/TextResponse");
// import Preferneces from '../../core/preferences';
var EndUseCaseResponse_1 = require("../../classes/EndUseCaseResponse");
// import GoogleCalendarConnector from '../../connectors/googleCalendar/googleCalendarConnector';
var exchangeratesConnector_1 = require("../../connectors/exchangerates/exchangeratesConnector");
var coingeckoConnector_1 = require("../../connectors/coingecko/coingeckoConnector");
var fs = require('fs');
var gcAuthentication = require('../../connectors/googleCalendar/googleCalendarAuthentication.ts');
var DailyFinancialStatus = /** @class */ (function () {
    function DailyFinancialStatus() {
        this.name = 'Daily financial status';
        this.triggers = ['financial', 'finance', 'finances'];
        // private googleCalendar = new GoogleCalendarConnector();
        this.exchangeRates = new exchangeratesConnector_1["default"]();
        this.coinGecko = new coingeckoConnector_1["default"]();
    }
    // constructor() {
    // }
    // eslint-disable-next-line class-methods-use-this
    DailyFinancialStatus.prototype.receiveMessage = function (message) {
        return __asyncGenerator(this, arguments, function receiveMessage_1() {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!message) return [3 /*break*/, 3];
                        return [4 /*yield*/, __await(new TextResponse_1["default"]('Here\'s a response'))];
                    case 1: return [4 /*yield*/, _a.sent()];
                    case 2:
                        _a.sent();
                        console.log('Done.');
                        _a.label = 3;
                    case 3: return [4 /*yield*/, __await(new EndUseCaseResponse_1["default"]())];
                    case 4: return [4 /*yield*/, _a.sent()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // eslint-disable-next-line class-methods-use-this
    DailyFinancialStatus.prototype.checkForEvents = function () {
        var _this = this;
        fs.readFile('../../../credentials.json', function (err, content) {
            if (err)
                return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Calendar API.
            gcAuthentication.authorize(JSON.parse(content), _this.listEvents);
        });
    };
    // eslint-disable-next-line class-methods-use-this
    DailyFinancialStatus.prototype.listEvents = function (auth) {
        var calendar = gcAuthentication.google.calendar({ version: 'v3', auth: auth });
        var calendarID = 'k.sonja1999@gmail.com';
        var startDate = new Date().getDate();
        var startMonth = new Date().getMonth();
        var startYear = new Date().getFullYear();
        var startHour = 0;
        var startMinute = 0;
        console.log(startDate, startMonth, startYear);
        calendar.freebusy.query({
            auth: auth,
            resource: {
                timeMin: (new Date(startYear, startMonth, startDate, startHour, startMinute)).toISOString(),
                // eslint-disable-next-line max-len
                timeMax: (new Date(startYear, startMonth, startDate, startHour + 28, startMinute)).toISOString(),
                items: [{ id: calendarID }]
            }
        })
            .then(function (answer) {
            var busyEvents = answer.data.calendars[calendarID].busy;
            // busy object is empty if there are no appointments or only all-day events
            console.log(answer.data);
            console.log(busyEvents);
            // if array is not empty: iterate over elements
            // check if one of its times equals preference time
            // if so, check for the events end time
            // reschedule information to end time of event
        });
    };
    // eslint-disable-next-line class-methods-use-this
    DailyFinancialStatus.prototype.reset = function () { };
    return DailyFinancialStatus;
}());
exports["default"] = DailyFinancialStatus;
// const axios = require('axios');
// const urlInitER = 'https://api.exchangeratesapi.io';
// const urlInitCG = 'https://api.coingecko.com/api/v3';
// const favCurrenciesER = ['USD', 'JPY', 'GBP', 'CHF'];
// const favCurrenciesCG = ['eur'];
// function fetchDataFrom(apiUrl) {
//   const newRequest = axios.get(apiUrl);
//   return newRequest;
// }
// function checkStatusCode(rawResponse) {
//   if (rawResponse.status === 200) {
//     // console.log('Status is OK.');
//     return Promise.resolve(rawResponse);
//   } if (rawResponse.status === 404) {
//     throw new Error('Content was not found.');
//   } else {
//     throw new Error(`Error occured - status: ${rawResponse.status}`);
//   }
// }
// function arrayContainsKey(array, key) {
//   for (let i = 0; i < array.length; i += 1) {
//     if (array[i] === key) {
//       return true;
//     }
//   }
//   return false;
// }
// function getCurrenciesER(responseAllCurrencies, requiredCurrencies) {
//   const result = {};
//   Object.keys(responseAllCurrencies.rates).forEach((key) => {
//     if (arrayContainsKey(requiredCurrencies, key)) {
//       result[key] = responseAllCurrencies.rates[key];
//     }
//   });
//   return result;
// }
// function getCurrenciesCG(responseAllCurrencies, requiredCurrencies) {
//   const result = {};
//   Object.keys(responseAllCurrencies.bitcoin).forEach((key) => {
//     if (arrayContainsKey(requiredCurrencies, key)) {
//       result[key] = responseAllCurrencies.bitcoin[key];
//     }
//   });
//   return result;
// }
// exports.urlInitER = urlInitER;
// exports.urlInitCG = urlInitCG;
// exports.fetchDataFrom = fetchDataFrom;
// exports.checkStatusCode = checkStatusCode;
// exports.arrayContainsKey = arrayContainsKey;
// exports.getCurrenciesER = getCurrenciesER;
// exports.getCurrenciesCG = getCurrenciesCG;
// // most recent data (exchange rate for 1 euro to all other currencies) from exchangerates API
// fetchDataFrom(`${urlInitER}/latest`)
//   .then((receivedResponse) => checkStatusCode(receivedResponse))
//   .then((allcurrencies) => getCurrenciesER(allcurrencies.data, favCurrenciesER))
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));
// // most recent data (value of 1 bitcoin in euro) from Coin Gecko API
// fetchDataFrom(`${urlInitCG}/simple/price?ids=bitcoin&vs_currencies=eur`)
//   .then((receivedResponse) => checkStatusCode(receivedResponse))
//   .then((allcurrencies) => getCurrenciesCG(allcurrencies.data, favCurrenciesCG))
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));
