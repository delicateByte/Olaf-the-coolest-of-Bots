/* eslint-disable import/order, import/first, @typescript-eslint/no-unused-vars */
import * as supertest from 'supertest';

import Preferences from '../core/preferences';
import app from './preferences-dashboard';

// jest.mock('express');
jest.mock('./auth');
jest.mock('../core/preferences');

import Auth from './auth';

const server = app.listen(3000);
const stopServer = () => server.close();

const request = supertest(app);

afterAll(() => {
  // Stop server after testing
  stopServer();
});


test('test / not authorized', async () => {
  // @ts-ignore
  Auth.isAuthenticated.mockImplementationOnce((req, res, next) => res.redirect('/login'));

  const res = await request.get('/');

  expect(res.statusCode).toBe(302);
});

test('test /', async () => {
  // @ts-ignore
  Auth.isAuthenticated.mockImplementationOnce((req, res, next) => next());

  const res = await request.get('/');

  expect(res.statusCode).toBe(200);
});

test('test /data/imageoftheday', async () => {
  // @ts-ignore
  Preferences.set.mockImplementationOnce(() => undefined);

  const res = await request.post('/data/imageoftheday').send({
    data: JSON.stringify({
      imageofthedayProactive: 'some_val',
      imageofthedayProactiveTime: 'some_val',
      imageofthedayRandom: 'some_val',
      imageofthedayTags: 'some_val',
    }),
  }).type('form');

  expect(res.statusCode).toBe(200);
});

test('test /data/dfstatus', async () => {
  // @ts-ignore
  Preferences.set.mockImplementationOnce(() => undefined);

  const res = await request.post('/data/dfstatus').send({
    data: JSON.stringify({
      dfstatusProactive: 'some_val',
      dfstatusProactiveTime: 'some_val',
      dfstatusCalendarID: 'some_val',
    }),
  }).type('form');

  expect(res.statusCode).toBe(200);
});

test('test /data/news', async () => {
  // @ts-ignore
  Preferences.set.mockImplementationOnce(() => undefined);

  const res = await request.post('/data/news').send({
    data: JSON.stringify({
      newsProactive: 'some_val',
      newsProactiveTime: 'some_val',
      newsKeywords: 'some_val',
    }),
  }).type('form');

  expect(res.statusCode).toBe(200);
});

test('test /login', async () => {
  const res = await request.get('/login');

  expect(res.statusCode).toBe(200);
});

test('test /login post', async () => {
  // @ts-ignore
  Auth.isAuthenticated.mockImplementationOnce((req, res, next) => next());
  // @ts-ignore
  Auth.authenticate.mockImplementationOnce(() => undefined);

  const res = await request.post('/login').send({ data: { password: 'some_pass' } }).type('form');

  expect(res.statusCode).toBe(302);
});

test('test /logout', async () => {
  // @ts-ignore
  Auth.logout.mockImplementationOnce(() => undefined);

  const res = await request.get('/logout');

  expect(res.statusCode).toBe(302);
});
