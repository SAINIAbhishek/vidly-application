const router = require('express').Router();
const CustomerController = require('./CustomerController');
const AuthsController = require('../auth/AuthsController');

router.route('/')
    .get(CustomerController.getAll)
    .post(CustomerController.create)

router.route('/:id')
    .get(CustomerController.get)
    .put(AuthsController.isAuthorized, CustomerController.update)
    .delete(AuthsController.isAuthorized, CustomerController.delete)

module.exports = router;
