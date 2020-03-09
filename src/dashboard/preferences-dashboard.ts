import * as express from 'express';
import * as session from 'express-session';
import * as mustache from 'mustache-express';
import * as bcrypt from 'bcryptjs';

// eslint-disable-next-line import/no-unresolved, import/extensions
import isAuthenticated from './auth';

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
app.get('/', isAuthenticated, (req, res) => {
  res.render('index');
});

// Register
app.get('/register', (req, res) => {
  res.send('Register');
});

// Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  console.log('post');
  console.log(req.body);

  res.redirect('/');
});

export default app;
