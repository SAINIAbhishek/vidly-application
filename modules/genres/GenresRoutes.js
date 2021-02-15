const router = require('express').Router();
const GenresController = require('./GenresController');
const AuthsController = require('../auth/AuthsController');

router.route('/')
    .get(GenresController.getAll)
    .post(AuthsController.isAuthorized, GenresController.create)

router.route('/:id')
    .get(GenresController.get)
    .put(AuthsController.isAuthorized, GenresController.update)
    .delete(AuthsController.isAuthorized, AuthsController.isAdmin, GenresController.delete)

module.exports = router;
