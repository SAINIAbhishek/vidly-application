'use strict';

const mongoose = require('mongoose');
const RentalsModel = mongoose.model('Rental');
const CustomersModel = mongoose.model('Customer');
const MoviesModel = mongoose.model('Movie');
const { validateRental } = require('./RentalsModel');

class RentalsController {

    static async getAll(req, res) {
        const rentals = await RentalsModel.find().sort('-dateOut');
        res.send(rentals);
    }

    static async get(req, res) {
        const rental = await RentalsModel.findById(req.params.id);
        if (!rental) return res.status(404).send('The rental with the given ID was not found.');
        res.send(rental);
    }

    static async create(req, res) {
        const { error } = validateRental(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const customer = await CustomersModel.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Invalid customer.');

        const movie = await MoviesModel.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid movie.');

        if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });

        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
            .run();

        res.send(rental);
    }

}

module.exports = RentalsController;
