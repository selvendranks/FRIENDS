
const Profile = require('./models/profile');


const isloggedin = (req,res,next)=>{
    console.log("req user",req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','you must be signed in');
        return res.redirect('/login');
    }
    next();
}

const isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const profile = await Profile.findById(id);
    console.log(req.user);
    if(profile.username!=req.user.username){
        req.flash("error","you dont have permission");
        return res.redirect(`/room/${id}`);
    }
    next();
}

const refreshPage = (req,res,next)=>{
    req.session.refresh = req.originalUrl;
    next()
}

module.exports.isAuthor = isAuthor;

module.exports.isloggedin = isloggedin;

module.exports.refreshPage = refreshPage;
