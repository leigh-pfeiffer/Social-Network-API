const router = require('express').Router();
const thoughtRoutes = require('./thought-routes.js');
const userRoutes = require('./user-routes.js');

// add prefix of `/pizzas` to routes created in `pizza-routes.js`
router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);


module.exports = router;