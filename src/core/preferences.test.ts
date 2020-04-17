/* eslint-disable import/order, import/first, @typescript-eslint/no-unused-vars */
import { LocalStorage } from 'node-localstorage';

jest.mock('node-localstorage');

import Preferences from './preferences';

test('get preference', () => {
  const mockLocalStorage = LocalStorage.mock.instances[0];
  mockLocalStorage.getItem.mockReturnValueOnce('{"property": "value"}');

  const pref = Preferences.get('service', 'property');

  expect(pref).toBe('value');
});

test('get preference is null', () => {
  const mockLocalStorage = LocalStorage.mock.instances[0];
  mockLocalStorage.getItem.mockReturnValueOnce(null);

  const pref = Preferences.get('service', 'property');

  expect(pref).toBeNull();
});

test('set preference', () => {
  const mockLocalStorage = LocalStorage.mock.instances[0];
  mockLocalStorage.getItem.mockReturnValueOnce('{"property": "value"}');

  Preferences.events().addListener('changed', (service, property) => {
    expect(service).toBe('service');
    expect(property).toBe('property');
  });

  Preferences.set('service', 'property', 'value');
});

test('set preference not set yet', () => {
  const mockLocalStorage = LocalStorage.mock.instances[0];
  mockLocalStorage.getItem.mockReturnValueOnce(null);

  Preferences.events().addListener('changed', (service, property) => {
    expect(service).toBe('service');
    expect(property).toBe('property');
  });

  Preferences.set('service', 'property', 'value');
});
