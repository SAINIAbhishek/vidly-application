const router = require('express').Router();
const AuthsController = require('./AuthsController');

router.route('/')
    .post(AuthsController.isAuthenticated)

module.exports = router;