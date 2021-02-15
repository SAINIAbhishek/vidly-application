'use strict';

const mongoose = require('mongoose');
const MoviesModel = mongoose.model('Movie');
const GenresModel = mongoose.model('Genre');
const { validateMovie } = require('./MoviesModel');

class MoviesController {

    static async getAll(req, res) {
        const movies = await MoviesModel.find().sort('name');
        res.send(movies);
    }

    static async get(req, res) {
        const movie = await MoviesModel.find({ _id: req.params.id });
        if (!movie) return res.status(404).send('The movie with the given ID was not found.');
        res.send(movie);
    }

    static async create(req, res) {
        const { error } = validateMovie(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await GenresModel.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid genre.');

        const movie = new MoviesModel({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.save();
        res.send(movie);
    }

    static async update(req, res) {
        const { error } = validateMovie(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await GenresModel.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid genre.');

        const movie = await MoviesModel.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, { new: true });

        if (!movie) return res.status(404).send('The movie with the given ID was not found.');
        res.send(movie);
    }

    static async delete(req, res) {
        const movie = await MoviesModel.findByIdAndRemove(req.params.id);
        if (!movie) return res.status(404).send('The movie with the given ID was not found.');
        res.send(movie);
    }

}

module.exports = MoviesController;
