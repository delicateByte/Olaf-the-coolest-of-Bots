/* eslint-disable import/order, import/first, @typescript-eslint/no-unused-vars */
import * as supertest from 'supertest';

import app from './preferences-dashboard';
import Auth from './auth';

jest.mock('./auth');
jest.mock('../core/preferences');

const request = supertest(app);


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

describe('test /data/', () => {
  beforeAll(() => {
    // @ts-ignore
    Auth.isAuthenticated.mockImplementation((req, res, next) => next());
  });

  test('imageoftheday', async () => {
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

  test('dfstatus', async () => {
    const res = await request.post('/data/dfstatus').send({
      data: JSON.stringify({
        dfstatusProactive: 'some_val',
        dfstatusProactiveTime: 'some_val',
        dfstatusCalendarID: 'some_val',
      }),
    }).type('form');

    expect(res.statusCode).toBe(200);
  });

  test('news', async () => {
    const res = await request.post('/data/news').send({
      data: JSON.stringify({
        newsProactive: 'some_val',
        newsProactiveTime: 'some_val',
        newsKeywords: 'some_val',
      }),
    }).type('form');

    expect(res.statusCode).toBe(200);
  });

  test('spotify', async () => {
    const res = await request.post('/data/spotify').send({
      data: JSON.stringify({
        spotifyCategory: 'some_val',
      }),
    }).type('form');

    expect(res.statusCode).toBe(200);
  });
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
