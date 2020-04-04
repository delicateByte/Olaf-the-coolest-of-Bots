import { LocalStorage } from 'node-localstorage';
import * as mockBcrypt from 'bcryptjs';
import * as moment from 'moment';

import Auth from './auth';

jest.mock('node-localstorage', jest.fn());
jest.mock('bcryptjs');

// Global setup
const sessionId = 'test1234';

const getNull = () => ({
  getItem: () => null,
});

const getVal = () => ({
  getItem: () => moment().toISOString(),
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  jest.resetModules();
});

test('isAuthenticated fail', () => {
  // Setup
  // const localStorage = new LocalStorage('./localstorage/session');
  // localStorage.getItem.mockReturnValue(null);
  LocalStorage.mockImplementation(() => getNull);

  jest.doMock('moment', () => () => ({ diff: () => 21 }));

  const req = { sessionId };
  const res = {
    redirect: () => 'redirect',
  };
  const next = () => 'next';

  // Work
  const result = Auth.isAuthenticated(req, res, next);

  // Expect
  expect(result).toBe('redirect');
});

test('authenticate fail', async () => {
  // Setup
  // @ts-ignore
  mockBcrypt.compareSync.mockImplementationOnce(() => false);

  // Work
  const result = Auth.authenticate(sessionId, 'wrong password');

  // Expect
  expect(result).toBe(false);
});

test('authenticate success', async () => {
  // Setup
  // @ts-ignore
  mockBcrypt.compareSync.mockImplementationOnce(() => true);

  // Work
  const result = Auth.authenticate(sessionId, 'test123');

  // Expect
  expect(result).toBe(true);
});

test('isAuthenticated success', () => {
  // Setup
  const localStorage = new LocalStorage('./localstorage/session');
  localStorage.getItem.mockImplementationOnce(() => moment().toISOString());

  jest.doMock('moment', () => () => ({ diff: () => 0 }));

  const req = { sessionId };
  const res = {
    redirect: () => 'redirect',
  };
  const next = () => 'next';

  // Work
  const result = Auth.isAuthenticated(req, res, next);

  // Expect
  expect(result).toBe('next');
});
