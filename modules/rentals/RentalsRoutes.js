const router = require('express').Router();
const RentalsController = require('./RentalsController');
const AuthsController = require('../auth/AuthsController');

router.route('/')
    .get(RentalsController.getAll)
    .post(AuthsController.isAuthorized, RentalsController.create)

router.route('/:id')
    .get(RentalsController.get)

module.exports = router;
