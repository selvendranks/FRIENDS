const express = require('express');
const passport = require('passport');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
router.use(express.urlencoded({extended : true}));
const users = require('../controllers/users');

router.route('/register')
      .get(users.renderRegisterForm)
      .post(catchAsync(users.registerUser));

router.route('/login')
      .get(catchAsync(users.renderLoginForm))
      .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),catchAsync(users.loginUser))


router.route('/test')
       .get(catchAsync(users.rendertestform));

router.get('/logout',users.logoutUser)
module.exports = router;