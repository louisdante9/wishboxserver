const express = require('express');
const winston = require('winston');
const { json, urlencoded } = require('body-parser');

const config = require('./app/config');
const db = require('./app/config/db');
const routes = require('./app/routes/v1');
const { GlobalErrorHandler } = require('./app/middleware');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use(json());
app.use(urlencoded({ extended: false }));
db(config)
  .then(() => {
    app.use('/v1', routes(express));
    app.use(GlobalErrorHandler);

    app.listen(port, err => {
      if (err) {
        throw new Error(err.message);
      }
      winston.info(`wishbox service is running on port ${port}`);
    });
  })
  .catch(err => { throw new Error(`Connection error: ${err.message}`); });

module.exports = app;
