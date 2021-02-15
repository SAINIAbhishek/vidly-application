'use strict';

const mongoose = require('mongoose');
const UsersModel = mongoose.model('User');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

class AuthsController {

    static validate(req) {
        const schema = {
            password: Joi.string().min(5).max(255).required(),
            email: Joi.string().min(5).max(255).email().required()
        };
        return Joi.validate(req, schema);
    }

    static async isAuthenticated(req, res) {
        const { error } = AuthsController.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await UsersModel.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('User not exist.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Email or Password is invalid.');

        const token = user.generateAuthToken();
        res.send(token);
    }

    static async isAdmin(req, res, next) {
        if (!req.user.isAdmin) return res.status(403).send('Access forbidden.');
        next();
    }

    static async isAuthorized(req, res, next) {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).send('Access denied. No token provided.');
        req.user = jwt.verify(token, config.get('jwtPrivateKey'));
        next();
    }

}

module.exports = AuthsController;
