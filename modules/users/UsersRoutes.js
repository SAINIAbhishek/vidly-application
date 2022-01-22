const router = require('express').Router();
const UsersController = require('./UsersController');
const AuthsController = require('../auth/AuthsController')

router.route('/')
    .post(UsersController.create)

router.route('/me')
    .get(AuthsController.isAuthorized, UsersController.getMe)

module.exports = router;
