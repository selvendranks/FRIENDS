const Post = require('../models/posts');

const Profile = require('../models/profile');
const User = require('../models/user');
const { post } = require('../routes/profile');
const {cloudinary} = require('../cloudinary');



module.exports.renderPost = async(req,res)=>{
    
    const {id} = req.params;
    const profile = await Profile.findById(id);
    res.render('post/new.ejs',{profile});
}

module.exports.addPost = async(req,res)=>{
  
    const {id} = req.params;
    //console.log(id);
    const profile = await Profile.findById(id);
    const post = new Post(req.body.Post);
    post.author = req.user._id;

    const imgs =   req.files.map(f=>({ url:f.path , filename:f.filename }));
    post.image.push(...imgs);
    profile.posts.push(post);
    await post.save();
    await profile.save();

    req.flash('sucess','Sucessfully added your post');
    res.redirect(req.session.refresh)

}

module.exports.deletePost = async (req,res)=>{

    //    console.log(req.params);
    const {id,postid} = req.params;

    const post = await Post.findById(postid);
 
     post.image.forEach((img,i) => { 
           cloudinary.uploader.destroy(img.filename);
        })

//    await Room.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});  //deletes the object in array of reviews which has reviewid
    await Post.findByIdAndDelete(postid);
    req.flash('sucess','Sucessfully deleted your post')
    res.redirect(req.session.refresh)
}

module.exports.addlike = async(req,res)=>{
    
    
    const {id,postid} = req.params;
    const post = await Post.findById(postid);
    console.log(post.likes);
    if(!post.likes.includes(req.user.username)){
        post.likes.push(req.user.username);
    }
    await post.save();
    var profile = await Profile.findById(id).populate({
        path :'posts',
        populate:{
            path:'reviews',
            populate:{
                path: 'author'
            }
        }
    }).populate('author');

   
    // res.render('profile/index.ejs',{profile});
    // res.redirect(req.session.refresh)
    res.json(post)
    
    
}

module.exports.addComment = async(req,res)=>{
    
    const {body} = req.body;

    console.log("************************************************************")
    console.log(body)
    const {id,postid} = req.params;
  

    const post = await Post.findOneAndUpdate({_id:postid},{$push:{reviews:{body:body,author:req.user.username}}},{new:true});
    
   
    
    // console.log(comment);
    res.json(post);
    // res.render('profile/index.ejs',{profile});

}

module.exports.deleteComment =  async(req,res)=>{
    
    console.log("########################################################3")
    console.log(req.params)
    const {id,postid,reviewid} = req.params;
    let deleted = await Post.findOneAndUpdate({_id:postid},{$pull:{reviews:{_id:reviewid}}},{new:true});
    console.log("updated sucessfully",deleted);
    res.redirect(req.session.refresh)

}