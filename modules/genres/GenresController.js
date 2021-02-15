'use strict';

const mongoose = require('mongoose');
const GenresModel = mongoose.model('Genre');
const { validateGenre } = require('./GenresModel');

class GenresController {

    static async get(req, res) {
        const genre = await GenresModel.find({ _id: req.params.id });
        if (!genre) return res.status(404).send('The genre with the given ID was not found.');
        res.send(genre);
    }

    static async getAll(req, res) {
        const genres = await GenresModel.find().sort('name');
        res.send(genres);
    }

    static async create(req, res) {
        const { error } = validateGenre(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let genre = new GenresModel({ name: req.body.name });
        genre = await genre.save();
        res.send(genre);
    }

    static async update(req, res) {
        const { error } = validateGenre(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await GenresModel.findByIdAndUpdate(
            { _id: req.params.id },
            { name: req.body.name },
            { new: true }
        );
        if (!genre) return res.status(404).send('The genre with the given ID was not found.');
        res.send(genre);
    }

    static async delete(req, res) {
        const genre = await GenresModel.findOneAndDelete({ _id: req.params.id });
        if (!genre) return res.status(404).send('The genre with the given ID was not found.');
        res.send(genre);
    }

}

module.exports = GenresController;
