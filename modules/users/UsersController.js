'use strict';

const mongoose = require('mongoose');
const UsersModel = mongoose.model('User');
const { validateUser } = require('./UsersModel');
const _ = require('lodash');
const bcrypt = require('bcrypt');

class UsersController {

    static async getMe(req, res) {
        const user = await UsersModel.findById(req.user._id).select('-password');
        res.send(user);
    }

    static async create(req, res) {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await UsersModel.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        user = new UsersModel(_.pick(req.body, ['name', 'email', 'password']));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = user.generateAuthToken();
        res.header({ 'x-auth-token': token }).send(_.pick(user, ['_id', 'name', 'email']));
    }

}

module.exports = UsersController;
