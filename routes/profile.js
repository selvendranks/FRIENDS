const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const { isloggedin,isAuthor,refreshPage} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const {storage} = require('../cloudinary'); 
const upload = multer({storage});

router.use(express.urlencoded({extended : true}));
router.use(methodOverride('_method'));

const profile = require('../controllers/profile');  

router.route('/')
      .get(isloggedin,refreshPage,catchAsync(profile.index))
      .post(isloggedin,upload.single('Profile[image]'),catchAsync(profile.addNewProfile));
      


router.get('/new',isloggedin,profile.renderNewForm);

router.route('/:id')
      .get(isloggedin,refreshPage, catchAsync(profile.index))
      .put(isloggedin,upload.single('Profile[image]'),catchAsync(profile.updateProfile));

router.get('/:id/edit',isloggedin,isAuthor,catchAsync(profile.renderEditForm));

module.exports = router;