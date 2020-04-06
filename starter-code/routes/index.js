const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET Sign-up route
  router.get('/sign-up', (req, res, next) => {
    res.render('sign_up');
  });

module.exports = router;
