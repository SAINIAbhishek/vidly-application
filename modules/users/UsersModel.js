const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 255
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024
    },
    isAdmin: {
        type: Boolean
    },
    roles: []
});

UserSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
};

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).email().required()
    };

    return Joi.validate(user, schema);
}

mongoose.model('User', UserSchema);
module.exports.validateUser = validateUser;
