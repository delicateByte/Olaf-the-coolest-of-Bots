import * as express from 'express';
import * as session from 'express-session';
import * as mustache from 'mustache-express';

// eslint-disable-next-line import/no-unresolved, import/extensions
import isAuthenticated from './auth';

const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {},
}));

// Configure Mustache
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', `${__dirname}/views`);

// Routes
// Dashboard
app.get('/', isAuthenticated, (req, res) => {
  res.render('index');
});

// Register
app.get('/register', (req, res) => {
  res.send('Register');
});

// Login
app.get('/login', (req, res) => {
  res.send('Login');
});

export default app;
