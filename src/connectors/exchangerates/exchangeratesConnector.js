"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var ExchangeratesConnector = /** @class */ (function () {
    function ExchangeratesConnector() {
        this.axios = axios_1["default"];
        this.baseURL = 'https://api.exchangeratesapi.io';
    }
    return ExchangeratesConnector;
}());
exports["default"] = ExchangeratesConnector;
