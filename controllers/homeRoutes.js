const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');
// homepage route
router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: Comment,
          attributes: ['description'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('all-post', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET one post
router.get('/post/:id', async (req, res) => {
  try {
    const postIDdata = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'description',
            'user_id',
            'post_id',
          ],
        },
      ],
    });

    const post = postIDdata.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', withAuth, async (req, res) => {
  try {
    // Get all post and JOIN with user data
    const postData = await post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'title', 'content', 'date_created'],

      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_content', 'date_created', 'post_id', 'user_id'],
          include: {
            model: User,
            attributes: ['username']
            }
        },
        {
          model: User,
          attributes: ['username'],
        },
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

// // Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/home', async (req, res) => {
  try {
    // Get all post and JOIN with user data
    const postData = await post.findAll({
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
    const post = postData.map((post) => post.get({ plain: true }));
  
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      post, 
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
