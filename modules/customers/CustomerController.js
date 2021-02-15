'use strict';

const mongoose = require('mongoose');
const CustomersModel = mongoose.model('Customer');
const { validateCustomer } = require('./CustomersModel');

class CustomerController {

    static async get(req, res) {
        const customer = await CustomersModel.find({ _id: req.params.id });
        if (!customer) return res.status(404).send('The customer with the given ID was not found.');
        res.send(customer);
    }

    static async getAll(req, res) {
        const customer = await CustomersModel.find().sort('name');
        res.send(customer);
    }

    static async create(req, res) {
        const { error } = validateCustomer(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let customer = new CustomersModel({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        });
        customer = await customer.save();
        res.send(customer);
    }

    static async update(req, res) {
        const { error } = validateCustomer(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const customer = await CustomersModel.findByIdAndUpdate(
            { _id: req.params.id },
            { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
            { new: true }
        );

        if (!customer) return res.status(404).send('The customer with the given ID was not found.');
        res.send(customer);
    }

    static async delete(req, res) {
        const customer = await CustomersModel.findOneAndDelete({ _id: req.params.id });
        if (!customer) return res.status(404).send('The customer with the given ID was not found.');
        res.send(customer);
    }

}

module.exports = CustomerController;
