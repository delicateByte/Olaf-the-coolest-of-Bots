import * as express from 'express';
import * as session from 'express-session';
import * as mustache from 'mustache-express';
import Preferences from '../core/preferences';

import Auth from './auth';

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

// Configure Mustache
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', `${__dirname}/views`);

// Routes
// Dashboard
app.get('/', Auth.isAuthenticated, (req, res) => {
  // Get saved values
  const imageoftheday = {
    imageofthedayProactive: Preferences.get('imageoftheday', 'imageofthedayProactive'),
    imageofthedayProactiveTime: Preferences.get('imageoftheday', 'imageofthedayProactiveTime'),
    imageofthedayRandom: Preferences.get('imageoftheday', 'imageofthedayRandom'),
    imageofthedayTags: Preferences.get('imageoftheday', 'imageofthedayTags'),
  };

  const dfstatus = {
    dfstatusProactive: Preferences.get('dfstatus', 'dfstatusProactive'),
    dfstatusProactiveTime: Preferences.get('dfstatus', 'dfstatusProactiveTime'),
    dfstatusCalendarID: Preferences.get('dfstatus', 'dfstatusCalendarID'),
  };

  const news = {
    newsProactive: Preferences.get('news', 'newsProactive'),
    newsProactiveTime: Preferences.get('news', 'newsProactiveTime'),
    newsKeywords: Preferences.get('news', 'newsKeywords'),
  };

  // Return all values
  const options = {
    imageoftheday,
    dfstatus,
    news,
  };

  res.render('index', options);
});

// Get dashboard data
app.post('/data/imageoftheday', (req, res) => {
  const data = JSON.parse(req.body.data);

  Preferences.set('imageoftheday', 'imageofthedayProactive', data.imageofthedayProactive);
  Preferences.set('imageoftheday', 'imageofthedayProactiveTime', data.imageofthedayProactiveTime);
  Preferences.set('imageoftheday', 'imageofthedayRandom', data.imageofthedayRandom);
  Preferences.set('imageoftheday', 'imageofthedayTags', data.imageofthedayTags);
  res.sendStatus(200);
});

app.post('/data/dfstatus', (req, res) => {
  const data = JSON.parse(req.body.data);

  Preferences.set('dfstatus', 'dfstatusProactive', data.dfstatusProactive);
  Preferences.set('dfstatus', 'dfstatusProactiveTime', data.dfstatusProactiveTime);
  Preferences.set('dfstatus', 'dfstatusCalendarID', data.dfstatusCalendarID);
  res.sendStatus(200);
});

app.post('/data/news', (req, res) => {
  const data = JSON.parse(req.body.data);

  Preferences.set('news', 'newsProactive', data.newsProactive);
  Preferences.set('news', 'newsProactiveTime', data.newsProactiveTime);
  Preferences.set('news', 'newsKeywords', data.newsKeywords);
  res.sendStatus(200);
});

// Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  Auth.authenticate(req.sessionID, req.body.password);
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  Auth.logout(req.sessionID);
  res.redirect('login');
});

export default app;
