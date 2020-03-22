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
app.get('/', Auth.isAuthenticated, async (req, res) => {
  // Get saved values
  // Unsplash
  const unsplash = {
    imgSource: Preferences.get('unsplash', 'unsplashImgSource'),
    keywords: Preferences.get('unsplash', 'unsplashKeywords'),
    isRandom: (Preferences.get('unsplash', 'unsplashImgSource') === 'random') ? 'checked' : '',
    isKeywords: (Preferences.get('unsplash', 'unsplashImgSource') === 'keywords') ? 'checked' : '',
  };

  // Reddit Memes
  const redditMemes = {
    subName: {
      selected: Preferences.get('redditMemes', 'redditSubName'),
      all: [
        { id: 'r/memes', name: 'r/memes' },
        { id: 'r/PewdiepieSubmissions', name: 'r/PewdiepieSubmissions' },
        { id: 'r/funny', name: 'r/funny' },
        { id: 'r/dankmemes', name: 'r/dankmemes' },
        { id: 'r/ich_iel', name: 'r/ich_iel' },
        { id: 'r/me_irl', name: 'r/me_irl' },
        { id: 'r/ProgrammerHumor', name: 'r/ProgrammerHumor' },
      ],
    },
  };

  redditMemes.subName.all = redditMemes.subName.all.map((s) => ({
    id: s.id,
    name: s.name,
    selected: (s.id === redditMemes.subName.selected),
  }));

  // Spotify
  const spotify = {
    userInfo: undefined,
    categories: {
      selected: Preferences.get('spotify', 'spotifyCategory'),
      all: [
        { id: 'toplists', name: 'Top-Listen' },
        { id: 'pop', name: 'Pop' },
        { id: 'mood', name: 'Stimmung' },
        { id: 'hiphop', name: 'Hip Hop' },
        { id: 'rock', name: 'Rock' },
        { id: 'chill', name: 'Chill' },
        { id: 'edm_dance', name: 'Electronic/Dance' },
        { id: 'wellness', name: 'Wellness' },
        { id: 'party', name: 'Party' },
        { id: 'decades', name: 'Jahrzehnte' },
        { id: 'indie_alt', name: 'Indie/Alternative' },
        { id: 'popculture', name: 'Trending' },
        { id: 'thirdparty', name: 'Tastemakers' },
        { id: 'kids', name: 'Kinder und Familie' },
        { id: 'roots', name: 'Folk & Akustik' },
        { id: 'soul', name: 'Soul' },
        { id: 'workout', name: 'Fitness' },
        { id: 'jazz', name: 'Jazz' },
        { id: 'latin', name: 'Latin' },
        { id: 'focus', name: 'Konzentration' },
        { id: 'dinner', name: 'Dinner' },
        { id: 'sleep', name: 'Schlaf' },
        { id: 'classical', name: 'Klassik' },
        { id: 'gaming', name: 'Gaming' },
        { id: 'metal', name: 'Metal' },
        { id: 'rnb', name: 'RnB' },
        { id: 'country', name: 'Country' },
        { id: 'travel', name: 'Reise' },
        { id: 'blues', name: 'Blues' },
        { id: 'punk', name: 'Punk' },
        { id: 'romance', name: 'Romantik' },
        { id: 'funk', name: 'Funk' },
        { id: 'reggae', name: 'Reggae' },
        { id: 'kpop', name: 'K-pop' },
        { id: 'audiobooks', name: 'Hörbücher' },
        { id: 'afro', name: 'Afro' },
        { id: 'arab', name: 'Arabisch' },
        { id: 'desi', name: 'Desi' },
      ],
    },
  };

  spotify.categories.all = spotify.categories.all.map((c) => ({
    id: c.id,
    name: c.name,
    selected: (c.id === spotify.categories.selected),
  }));

  if (Spotify.isAuthorized()) {
    spotify.userInfo = await Spotify.getUserInfo();
  }


  // Return all values
  const options = {
    unsplash,
    redditMemes,
    spotify,
  };

  res.render('index', options);
});

// Forms
// Unsplash
app.post('/data/unsplash', Auth.isAuthenticated, (req, res) => {
  const { unsplashImgSource } = req.body;
  const { unsplashKeywords } = req.body;

  Preferences.set('unsplash', 'unsplashImgSource', unsplashImgSource);
  Preferences.set('unsplash', 'unsplashKeywords', unsplashKeywords);

  res.sendStatus(200);
});

// Reddit Memes
app.post('/data/redditMemes', Auth.isAuthenticated, (req, res) => {
  const { redditSubName } = req.body;

  Preferences.set('redditMemes', 'redditSubName', redditSubName);

  res.sendStatus(200);
});

// Spotify
app.post('/data/spotify', Auth.isAuthenticated, (req, res) => {
  const { spotifyCategory } = req.body;

  Preferences.set('spotify', 'spotifyCategory', spotifyCategory);

  res.sendStatus(200);
});
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
