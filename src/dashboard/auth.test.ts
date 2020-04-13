/* eslint-disable import/order, import/first, @typescript-eslint/no-unused-vars */
import * as express from 'express';
import * as session from 'express-session';
import * as supertest from 'supertest';
import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';
import { LocalStorage } from 'node-localstorage';

jest.mock('bcryptjs');
jest.mock('node-localstorage');

import Auth from './auth';

// Mock server
const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({
  extended: true,
}));

app.get('/test', Auth.isAuthenticated, (req, res) => res.sendStatus(200));
app.get('/login', (req, res) => res.sendStatus(200));

const server = app.listen(3000);
const stopServer = () => server.close();

const request = supertest(app);

afterAll(() => {
  // Stop server after testing
  stopServer();
});

test('authenticate fails', () => {
  // @ts-ignore
  bcrypt.compareSync.mockImplementationOnce(() => false);
  // localStorage.removeItem.mockImplementationOnce(() => 'item');

  const auth = Auth.authenticate('some_id', 'some_pass');

  expect(auth).toBe(false);
});

test('authenticate', () => {
  // @ts-ignore
  bcrypt.compareSync.mockImplementationOnce(() => true);
  // // @ts-ignore
  // localStorage.setItem.mockImplementationOnce(() => undefined);

  const auth = Auth.authenticate('some_id', 'some_pass');

  expect(auth).toBe(true);
});

test('callback route fails', async (done) => {
  const mockLocalStorage = LocalStorage.mock.instances[0];

  mockLocalStorage.getItem.mockImplementationOnce(() => null);
  mockLocalStorage.removeItem.mockImplementationOnce(() => undefined);

  // @ts-ignore
  bcrypt.compareSync.mockImplementationOnce(() => true);

  const res = await request.get('/test');

  expect(res.statusCode).toBe(302);

  done();
});

test('callback route', async (done) => {
  const mockLocalStorage = LocalStorage.mock.instances[0];

  mockLocalStorage.getItem.mockImplementationOnce(() => moment().toISOString());
  mockLocalStorage.setItem.mockImplementationOnce(() => undefined);

  const res = await request.get('/test');

  expect(res.statusCode).toBe(200);

  done();
});
