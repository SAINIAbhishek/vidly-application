'use strict';

const router = require('express').Router();

router.use('/auth', require('./modules/auth/AuthsRoutes'));
router.use('/genres', require('./modules/genres/GenresRoutes'));
router.use('/customers', require('./modules/customers/CustomersRoutes'));
router.use('/movies', require('./modules/movies/MoviesRoutes'));
router.use('/rentals', require('./modules/rentals/RentalsRoutes'));
router.use('/users', require('./modules/users/UsersRoutes'));
router.use('/returns', require('./modules/returns/ReturnsRoutes'));

module.exports = router;
