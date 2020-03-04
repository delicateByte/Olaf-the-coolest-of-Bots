import * as express from 'express';

const app = express();

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

export default app;
