'use strict';

require('express-async-errors');
require('winston-mongodb');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const error = require('./middelware/error');
const winston = require('winston');

// logging
winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

process.on('unhandledRejection', (ex) => {
    throw ex;
});

winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly',
    level: 'info'
});

// configuration
const config = require('config');
if (!config.get('jwtPrivateKey')) {
    throw new Error('Fatal Error: Private key is not defined.');
}

// validation
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

app.use(helmet());
app.use(morgan('tiny'));

// api models
require('./ApiModels');

// It parses incoming requests with JSON payloads and is based on body-parser.
// app.use(express.json());

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json({
    limit: '15mb'
}));

app.use(bodyParser.urlencoded({
    limit: '15mb',
    extended: true
}));

// app routes
app.use('/api', require('./ApiRoutes'));

// express error middleware
app.use(error);

// connect db initialization
const mongoParams = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}
/**
 * to set env = test for integration testing.
 * NODE_ENV=test nodemon index.js
 */
mongoose.connect(config.get('db'), mongoParams)
    .then(() => {
        winston.info(`Connected to the ${config.get('db')}.`);
    });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.log(`Listening on port ${port}...`));

module.exports = server;
