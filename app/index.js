const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');


// Set mongoose promise to the global promise
mongoose.promise = global.Promise;

// Variable to determine if the app is running on a live/production server
const isProduction = process.env.NODE_ENV === 'production';

// Initiate the node app via express
const app = express();

// Configuration for the app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'passport-auth',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));

// Use Error Handler if the application is in development mode
if (!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect('mongodb://localhost/passport-auth', { useNewUrlParser: true });
mongoose.set('debug', true);

//Error handlers & middlewares
if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
