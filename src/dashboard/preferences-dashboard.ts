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

  // Return all values
  const options = {
    imageoftheday,
  };

  console.log('options: ', options);

  res.render('index', options);
});

// Get dashboard data
app.get('/json/dashboard', Auth.isAuthenticated, (req, res) => {
  res.json({ test: true });
});

app.post('/data/imageoftheday', (req, res) => {
  const data = JSON.parse(req.body.data);

  Preferences.set('imageoftheday', 'imageofthedayProactive', data.imageofthedayProactive);
  Preferences.set('imageoftheday', 'imageofthedayProactiveTime', data.imageofthedayProactiveTime);
  Preferences.set('imageoftheday', 'imageofthedayRandom', data.imageofthedayRandom);
  Preferences.set('imageoftheday', 'imageofthedayTags', data.imageofthedayTags);
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
