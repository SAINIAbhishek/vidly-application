const mongoose = require('mongoose');
const Joi = require('joi');

const CustomerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 15
    },
});

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(15).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
}

mongoose.model('Customer', CustomerSchema);
module.exports.validateCustomer = validateCustomer;
