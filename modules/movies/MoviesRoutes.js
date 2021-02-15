const router = require('express').Router();
const MoviesController = require('./MoviesController');
const AuthsController = require('../auth/AuthsController');

router.route('/')
    .get(MoviesController.getAll)
    .post(AuthsController.isAuthorized, MoviesController.create)

router.route('/:id')
    .get(MoviesController.get)
    .put(AuthsController.isAuthorized, MoviesController.update)
    .delete(AuthsController.isAuthorized, MoviesController.delete)

module.exports = router;
