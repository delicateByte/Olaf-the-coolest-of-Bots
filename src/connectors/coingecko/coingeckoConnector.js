"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var CoingeckoConnector = /** @class */ (function () {
    function CoingeckoConnector() {
        this.axios = axios_1["default"];
        this.baseURL = 'https://api.coingecko.com/api/v3';
    }
    return CoingeckoConnector;
}());
exports["default"] = CoingeckoConnector;
