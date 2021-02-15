'use strict';

const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const error = require('./middelware/error');
require('express-async-errors');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const config = require('config');
if (!config.get('jwtPrivateKey')) {
    console.log('Fatal Error: Private key is not defined.');
    process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

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
mongoose.connect('mongodb://localhost/vidly', mongoParams)
    .then(() => {
        console.info('Connected to the MongoDB.');
    })
    .catch((err) => {
        console.error('Could not connect to the MongoDB.');
        process.exit(1);
    })
