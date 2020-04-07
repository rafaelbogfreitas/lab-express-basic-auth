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

// Login  GET 
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  
  let name  = req.body.username;
  let userPassword  = req.body.password;

  User.find({username: name})
    .then( user => {
      if(user.length == 0){
        res.render('login', { message: "User does not exist"});
      } else if (!bcrypt.compareSync(userPassword, user[0].password)){
        res.render('login', { message: "Wrong password!"});
      } else {
        req.session.currentUser = user;
        res.render('main', { username: name });
      }
    })
    .catch( error => console.log(error));
})


router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  } else {                          
    res.redirect("/login");         
  }                                 
});

router.get('/main', (req, res) => {
  res.render('main')
})

router.get('/private', (req, res) => {
  res.render('private');
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
})












module.exports = router;

