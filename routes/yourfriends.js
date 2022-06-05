const express = require('express');
const passport = require('passport');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
router.use(express.urlencoded({extended : true}));
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const yourfriends = require('../controllers/yourfriends');
const { isloggedin,refreshPage} = require('../middleware');


router.get('/',isloggedin,catchAsync(yourfriends.showFriends));
router.get('/new',isloggedin,catchAsync(yourfriends.findPeople));
router.get('/find',isloggedin,refreshPage,catchAsync(yourfriends.showPeople));
router.get('/viewProfile',isloggedin,catchAsync(yourfriends.viewPeople));
router.get('/addFriend',isloggedin,catchAsync(yourfriends.addPeople));
router.get('/friendRequest',isloggedin,catchAsync(yourfriends.friendRequest));
router.get('/decisions',isloggedin,catchAsync(yourfriends.decision));
router.get('/removeFriend',isloggedin,catchAsync(yourfriends.removeFriends));
router.get('/feeds',refreshPage,isloggedin,catchAsync(yourfriends.seefeeds));

module.exports = router;