const router = require('express').Router();
const userRoutes = require('./user-routes');
const projectRoutes = require('./postRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;
