import * as express from 'express';
import * as session from 'express-session';
import * as mustache from 'mustache-express';
import { LocalStorage } from 'node-localstorage';

// eslint-disable-next-line import/no-unresolved, import/extensions
import Auth from './auth';

const app = express();
const localStorage = new LocalStorage('./localstorage/settings');

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
  const unsplash = JSON.parse(localStorage.getItem('unsplashValues'));

  // Parse values for check/radiobox display
  unsplash.isRandom = (unsplash.imgSource === 'random') ? 'checked' : '';
  unsplash.isKeywords = (unsplash.imgSource === 'keywords') ? 'checked' : '';

  // Return all values
  const options = {
    unsplash,
  };
  res.render('index', options);
});

// Get dashboard data
app.get('/json/dashboard', Auth.isAuthenticated, (req, res) => {
  res.json({ test: true });
});

app.post('/data/unsplash', (req, res) => {
  console.log('POST', req.body);

  localStorage.setItem('unsplashValues', JSON.stringify(req.body));
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
