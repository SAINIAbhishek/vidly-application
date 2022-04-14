const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const router = require('express').Router();
const mongoose = require('mongoose');
const moment = require('moment');
const Movie = mongoose.model('Movie');
const Rental = mongoose.model('Rental');
const AuthsController = require('../auth/AuthsController');
const validate = require('../../middelware/validate');

router.post('/', AuthsController.isAuthorized, validate(validateReturn), async (req, res) => {

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });

    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    rental.dateReturned = new Date();
    rental.rentalFee = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate;
    // rental.return();
    await rental.save();

    await Movie.findByIdAndUpdate({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;
