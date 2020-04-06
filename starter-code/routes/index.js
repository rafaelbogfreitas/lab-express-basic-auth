const express = require('express');
const router  = express.Router();

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


// GET Sign-up route
router.get('/sign-up', (req, res, next) => {
  res.render('sign_up');
});


// POST Sign-up route
router.post('/sign-up', (req, res, next) => {

  let { username, password } = req.body;

  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hash = bcrypt.hashSync(password, salt);

  let register = {
    username:username,
    password:hash
  }

  User.find({username: username})
    .then(response => {
      if(response.length == 0){
        User.create(register)
          .then( response => {
            console.log(response);
            res.render('login', { message: "Register successful. Please login."})
          })
          .catch( error => console.log(error));
      } else {
        res.render('sign_up', { user: 'User already registered'})
      }
    })
    .catch( error => console.log(error));


});

module.exports = router;
