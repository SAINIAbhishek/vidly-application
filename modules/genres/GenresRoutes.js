const router = require('express').Router();
const GenresController = require('./GenresController');
const AuthsController = require('../auth/AuthsController');
const ValidateObjectId = require('../../middelware/validateObjectId');

router.route('/')
    .get(GenresController.getAll)
    .post(AuthsController.isAuthorized, GenresController.create)

router.route('/:id')
    .get(ValidateObjectId, GenresController.get)
    .put(ValidateObjectId, AuthsController.isAuthorized, GenresController.update)
    .delete(ValidateObjectId, AuthsController.isAuthorized, AuthsController.isAdmin, GenresController.delete)

module.exports = router;
