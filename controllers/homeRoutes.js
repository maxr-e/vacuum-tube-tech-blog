const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
// homepage route
router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'date_created'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_content', 'post_id', 'user_id'],
          include: {
            model: User,
            attributes: ['username'],
          }
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', { 
      posts, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/home', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'date_created'],
          
          include: [{
                  model: User,
                  attributes: [
                      'username',
                  ]
              },

              {
                  model: Comment,
                  attributes: ['id', 'comment_content', 'post_id', 'user_id'],
                  include: {
                      model: User,
                      attributes: ['username']
                  }
              },
          ]
        })
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
  
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET one post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'content',
        'title',
        'date_created'
      ],
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_content',
            'date_created',
            'user_id',
            'post_id',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes:['username'],
        }
      ],
    });

    const post = postData.get({ plain: true });

    res.render('single_post', {
      ...post,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
