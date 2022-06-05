const User = require('../models/user');
const Room = require('../models/profile');
const Profile = require('../models/profile');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register');
}

module.exports.registerUser = async (req,res)=>{
    try{
      const {username,email,password} = req.body;
      const user = new User({username , email});
      const registeredUser = await User.register(user,password);
      req.login(registeredUser,err=>{
          if(err) return next(err);
          // req.flash('sucess',"Welcome to yelpcamp");
          // res.redirect('/room');
      })
      req.flash('sucess',"Welcome to Friends+");
      res.redirect('/friends/new');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
     
  }

  module.exports.renderLoginForm = async(req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = async(req,res)=>{
    req.flash("sucess","Welcome back");
    const profile = await Profile.findOne({username : req.user.username});
    // res.redirect('/friends/new');
    
    // res.render('profile/index.ejs',{profile});
    try{
    res.redirect(`/friends/${profile._id}`);
    }
    catch(e){
    res.redirect('/friends/new')
    }
}

module.exports.logoutUser = (req,res)=>{
    req.logOut();
    req.flash('sucess','sucessfully logged out');
    res.redirect('/');
}

module.exports.renderOtp = async(req,res)=>{
    
    res.render('users/otp.ejs');
    

}

