import { LocalStorage } from 'node-localstorage';
import { EventEmitter } from 'events';

const localStorage = new LocalStorage('./localstorage/settings');
const eventEmitter = new EventEmitter();

export default class Preferences {
  static get(service, property) {
    const serviceString = localStorage.getItem(service);

    if (serviceString !== null) {
      const serviceObject = JSON.parse(serviceString);
      return serviceObject[property];
    }

    return undefined;
  }

  static set(service, property, value) {
    const serviceString = localStorage.getItem(service);
    let serviceObject;

    if (serviceString !== null) {
      // Already has settings
      serviceObject = JSON.parse(serviceString);
    } else {
      // New entry
      serviceObject = {};
    }

    serviceObject[property] = value;
    localStorage.setItem(service, JSON.stringify(serviceObject));
    eventEmitter.emit('changed', service, property);
  }

  static events(): EventEmitter {
    return eventEmitter;
  }
}
