import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./localstorage/settings');

class Preferences {
  private static readonly defaults: Array<[string, string, any]> = [
    ['imageoftheday', 'imageofthedayProactive', false],
    ['imageoftheday', 'imageofthedayProactiveTime', '08:00'],
    ['imageoftheday', 'imageofthedayRandom', true],
    ['imageoftheday', 'imageofthedayTags', ''],
  ];

  static initialize(): void {
    Preferences.defaults.forEach((preference) => {
      const [service, property, value] = preference;
      if (!this.get(service, property)) {
        this.set(service, property, value);
      }
    });
  }

  static get(service: string, property: string): any {
    const serviceString = localStorage.getItem(service);

    if (serviceString !== null) {
      const serviceObject = JSON.parse(serviceString);
      return serviceObject[property];
    }

    return null;
  }

  static set(service: string, property: string, value: any): void {
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
  }
}
export default Preferences;
