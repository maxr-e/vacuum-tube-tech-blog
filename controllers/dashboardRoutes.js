const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


  router.get('/', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Blog }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('dashboard', {
        ...user,
        loggedIn: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });



// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Blog }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('dashboard', {
        ...user,
        loggedIn: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;