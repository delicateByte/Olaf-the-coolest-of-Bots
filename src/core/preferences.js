"use strict";
exports.__esModule = true;
var node_localstorage_1 = require("node-localstorage");
var events_1 = require("events");
var localStorage = new node_localstorage_1.LocalStorage('./localstorage/settings');
var eventEmitter = new events_1.EventEmitter();
var Preferences = /** @class */ (function () {
    function Preferences() {
    }
    Preferences.initialize = function () {
        var _this = this;
        Preferences.defaults.forEach(function (preference) {
            var service = preference[0], property = preference[1], value = preference[2];
            if (!_this.get(service, property)) {
                _this.set(service, property, value);
            }
        });
    };
    Preferences.get = function (service, property) {
        var serviceString = localStorage.getItem(service);
        if (serviceString !== null) {
            var serviceObject = JSON.parse(serviceString);
            return serviceObject[property];
        }
        return null;
    };
    Preferences.set = function (service, property, value) {
        var serviceString = localStorage.getItem(service);
        var serviceObject;
        if (serviceString !== null) {
            // Already has settings
            serviceObject = JSON.parse(serviceString);
        }
        else {
            // New entry
            serviceObject = {};
        }
        serviceObject[property] = value;
        localStorage.setItem(service, JSON.stringify(serviceObject));
        eventEmitter.emit('changed', service, property);
    };
    Preferences.events = function () {
        return eventEmitter;
    };
    Preferences.defaults = [
        ['imageoftheday', 'imageofthedayProactive', false],
        ['imageoftheday', 'imageofthedayProactiveTime', '08:00'],
        ['imageoftheday', 'imageofthedayRandom', true],
        ['imageoftheday', 'imageofthedayTags', ''],
        ['redditMemes', 'redditMemesSubName', 'r/memes'],
        ['spotify', 'spotifyCategory', 'party'],
        ['dfstatus', 'dfstatusProactive', false],
        ['dfstatus', 'dfstatusProactiveTime', '08:00'],
        ['dfstatus', 'dfstatusCalendarID', ''],
        ['news', 'newsProactive', false],
        ['news', 'newsProactiveTime', '08:00'],
        ['news', 'newsKeywords', ''],
    ];
    return Preferences;
}());
exports["default"] = Preferences;
