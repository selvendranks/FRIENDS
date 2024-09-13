const User = require("../models/user");
const Room = require("../models/profile");
const Profile = require("../models/profile");
const nodemailer = require("nodemailer");
var crypto = require("crypto");
const { cloudinary } = require("../cloudinary");


module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      // req.flash('sucess',"Welcome to yelpcamp");
      // res.redirect('/room');
    });
    req.flash("sucess", "Welcome to Friends+");
    res.redirect("/friends/new");
  } catch (e) {
    req.flash("error", "Sorry the username or email has been already registered");
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = async (req, res) => {
  req.flash("sucess", "Welcome back");
  const profile = await Profile.findOne({ username: req.user.username });
  // res.redirect('/friends/new');

  // res.render('profile/index.ejs',{profile});
  try {
    res.redirect(`/friends/${profile._id}`);
  } catch (e) {
    res.redirect("/friends/new");
  }
};

module.exports.logoutUser = (req, res) => {
  req.logOut();
  req.flash("sucess", "sucessfully logged out");
  res.redirect("/");
};

module.exports.renderForgotPasswordForm = (req, res) => {

  res.render("users/forgotPasswordForm");
};

module.exports.verifyMail = async(req,res)=>{

  const {body} = req.body;
  if(req.signedCookies.Otp  === body){
     res.json({"verified":"true"})
  }
  else{
    
    res.json({"verified":"false"})
  }
}

module.exports.generateOtptoRegister = async(req,res)=>{
  const {body} = req.body;

  let otp = Math.floor((Math.random() * 1000000) );
  const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });


  const mailData = {
    from: process.env.EMAIL ,  // sender address
      to: `${body}`,   // list of receivers
      subject: 'Email verification otp',
      text: 'your otp',
      html: `<h1>Welocome to Friends+  ;)</h1>your OTP : <p style="font-size:40px;color:blue;">${otp}</p>. please dont share with anyone`
             
    };

    transporter.sendMail(mailData, function (err, info) {
        if(err) 
          throw new Error("Problem sending mail")
        else
          { let tries =0;
            console.log(info);
            res.cookie('Otp', `${otp}`, { signed: true })
            res.cookie('Retries', `${tries}`)
            res.json({'Otp':`:|`});
          }
     });
     
    

}

module.exports.generateOtp = async(req,res)=>{

  console.log("**************************************");
  const {body} = req.body;
  const user = await User.findOne({email: body});

  if(!user){
    res.json({"message": "Sorry your email is not registered !!"});
  }

  const randomOtp = crypto.randomBytes(20).toString('hex');
  const data = await User.updateOne({email:body},{$set:{token:randomOtp}})
  console.log(data)


  const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });


  const mailData = {
    from: process.env.EMAIL,  // sender address
      to: `${body}`,   // list of receivers
      subject: 'Reset Password OTL',
      text: 'your Link',
      html: `<h2>We missed you a lot. Welocome Back ;)</h2><b><a href='https://friends-tp1g.onrender.com/forgotPassword/${randomOtp}'>Reset Your password</a></b>. please dont share the link with anyone`
             
    };

    transporter.sendMail(mailData, function (err, info) {
        if(err)
          console.log("###################################")
        else
         {console.log(info);
         res.json({"message":"it worked"});}
     });

  
}

module.exports.renderChangePasswordForm = async(req,res)=>{

  const user = await User.findOne({token: `${req.params.id}`});
  if(!user){
    throw new Error("Something went wrong , try sending Mail verification again");
  }
  else{
    res.render('users/changePasswordForm',{token:user.token})

  }


}

module.exports.resetPassword = async(req,res) =>{
  
  let message = ""
  const {password,username} = req.body;
  const user = await User.findOne({token: `${req.params.id}`});
  if(!user){
    throw new Error("Something went wrong , try sending Mail verification again");
  }
  else{

    user.setPassword(password,async function(){
      await user.save();
    })
    
    if(username){
      await User.updateOne({email:user.email},{$set:{username:username}})
      message = "and username";
      await Profile.updateOne({email:user.email},{$set:{username:username}})
    }


     
    await User.updateOne({token:req.params.id},{$set:{token:'none'}});
    req.flash("sucess", `you have sucessfully updated password ${message}`);
    
    req.session.save(function(err) {
      // session saved
      console.log('session saved');
      res.redirect('/login');
    });

  }

}



