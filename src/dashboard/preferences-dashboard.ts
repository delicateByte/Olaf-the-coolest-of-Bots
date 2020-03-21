/* eslint-disable import/no-unresolved, import/extensions */
import * as express from 'express';
import * as session from 'express-session';
import * as mustache from 'mustache-express';

import Preferences from '../preferences';

import Auth from './auth';
import Spotify from '../connectors/spotify/spotify';

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
  const unsplash = {
    imgSource: Preferences.get('unsplash', 'imgSource'),
    keywords: Preferences.get('unsplash', 'keywords'),
    isRandom: (Preferences.get('unsplash', 'imgSource') === 'random') ? 'checked' : '',
    isKeywords: (Preferences.get('unsplash', 'imgSource') === 'keywords') ? 'checked' : '',
  };

  const redditMemes = {
    subName: Preferences.get('redditMemes', 'subName'),
    isMemes: (Preferences.get('redditMemes', 'subName') === 'r/memes') ? 'selected' : '',
    isPewdiepieSubmissions: (Preferences.get('redditMemes', 'subName') === 'r/PewdiepieSubmissions') ? 'selected' : '',
    isFunny: (Preferences.get('redditMemes', 'subName') === 'r/funny') ? 'selected' : '',
    isDankmemes: (Preferences.get('redditMemes', 'subName') === 'r/dankmemes') ? 'selected' : '',
    isIch_iel: (Preferences.get('redditMemes', 'subName') === 'r/ich_iel') ? 'selected' : '',
    isMe_irl: (Preferences.get('redditMemes', 'subName') === 'r/me_irl') ? 'selected' : '',
    isProgrammerHumor: (Preferences.get('redditMemes', 'subName') === 'r/ProgrammerHumor') ? 'selected' : '',
  };

  // Return all values
  const options = {
    unsplash,
    redditMemes,
  };
  res.render('index', options);
});

// Unsplash
app.post('/data/unsplash', (req, res) => {
  const { imgSource } = req.body;
  const { keywords } = req.body;

  Preferences.set('unsplash', 'imgSource', imgSource);
  Preferences.set('unsplash', 'keywords', keywords);
  // localStorage.setItem('unsplashValues', JSON.stringify(req.body));
  res.sendStatus(200);
});

// Reddit Memes
app.post('/data/redditMemes', (req, res) => {
  const { subName } = req.body;

  Preferences.set('redditMemes', 'subName', subName);
  res.sendStatus(200);
});

// Spotify
app.get('/auth/spotify', Spotify.authRoute);
app.get('/callback/spotify', Spotify.callbackRoute);

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
