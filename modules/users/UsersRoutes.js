const router = require('express').Router();
const UsersController = require('./UsersController');
const AuthsController = require('../auth/AuthsController')

router.route('/')
    .get(AuthsController.isAuthorized, UsersController.getMe)
    .post(UsersController.create)

module.exports = router;
