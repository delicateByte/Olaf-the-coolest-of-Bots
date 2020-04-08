/* eslint-disable import/no-unresolved, import/extensions */
import * as express from 'express';
import * as session from 'express-session';
import * as mustache from 'mustache-express';
import Preferences from '../core/preferences';

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
  const imageoftheday = {
    imageofthedayProactive: Preferences.get('imageoftheday', 'imageofthedayProactive'),
    imageofthedayProactiveTime: Preferences.get('imageoftheday', 'imageofthedayProactiveTime'),
    imageofthedayRandom: Preferences.get('imageoftheday', 'imageofthedayRandom'),
    imageofthedayTags: Preferences.get('imageoftheday', 'imageofthedayTags'),
  };

  // Reddit Memes
  const redditMemes = {
    redditMemesSubName: {
      selected: Preferences.get('redditMemes', 'redditMemesSubName'),
      all: [
        { id: 'r/memes', name: 'r/memes' },
        { id: 'r/ProgrammerHumor', name: 'r/ProgrammerHumor' },
        { id: 'r/funny', name: 'r/funny' },
        { id: 'r/ich_iel', name: 'r/ich_iel' },
        { id: 'r/me_irl', name: 'r/me_irl' },
        { id: 'r/dankmemes', name: 'r/dankmemes' },
        { id: 'r/PewdiepieSubmissions', name: 'r/PewdiepieSubmissions' },
      ],
    },
  };

  redditMemes.redditMemesSubName.all = redditMemes.redditMemesSubName.all.map((s) => ({
    id: s.id,
    name: s.name,
    selected: (s.id === redditMemes.redditMemesSubName.selected),
  }));

  // Spotify
  const spotify = {
    userInfo: undefined,
    spotifyCategory: {
      selected: Preferences.get('spotify', 'spotifyCategory'),
      all: [
        { id: 'toplists', name: 'Top-Listen' },
        { id: 'pop', name: 'Pop' },
        { id: 'mood', name: 'Stimmung' },
        { id: 'hiphop', name: 'Hip Hop' },
        { id: 'rock', name: 'Rock' },
        { id: 'chill', name: 'Chill' },
        { id: 'edm_dance', name: 'Electronic/Dance' },
        { id: 'party', name: 'Party' },
        { id: 'decades', name: 'Jahrzehnte' },
        { id: 'indie_alt', name: 'Indie/Alternative' },
        { id: 'popculture', name: 'Trending' },
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
        { id: 'afro', name: 'Afro' },
        { id: 'arab', name: 'Arabisch' },
        { id: 'desi', name: 'Desi' },
      ],
    },
  };

  spotify.spotifyCategory.all = spotify.spotifyCategory.all.map((c) => ({
    id: c.id,
    name: c.name,
    selected: (c.id === spotify.spotifyCategory.selected),
  }));

  if (Spotify.isAuthorized()) {
    spotify.userInfo = await Spotify.getUserInfo();
  }


  // Return all values
  const options = {
    imageoftheday,
    redditMemes,
    spotify,
  };

  res.render('index', options);
});

// Forms
// Unsplash
app.post('/data/imageoftheday', Auth.isAuthenticated, (req, res) => {
  const data = JSON.parse(req.body.data);

  Preferences.set('imageoftheday', 'imageofthedayProactive', data.imageofthedayProactive);
  Preferences.set('imageoftheday', 'imageofthedayProactiveTime', data.imageofthedayProactiveTime);
  Preferences.set('imageoftheday', 'imageofthedayRandom', data.imageofthedayRandom);
  Preferences.set('imageoftheday', 'imageofthedayTags', data.imageofthedayTags);

  res.sendStatus(200);
});

// Reddit Memes
app.post('/data/redditMemes', Auth.isAuthenticated, (req, res) => {
  const data = JSON.parse(req.body.data);

  Preferences.set('redditMemes', 'redditMemesSubName', data.redditMemesSubName);

  res.sendStatus(200);
});

// Spotify
app.post('/data/spotify', Auth.isAuthenticated, (req, res) => {
  const data = JSON.parse(req.body.data);

  Preferences.set('spotify', 'spotifyCategory', data.spotifyCategory);

  res.sendStatus(200);
});

// Authentications
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
