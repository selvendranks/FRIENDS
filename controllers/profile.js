const Profile = require("../models/profile");
const Post = require("../models/posts");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const { id } = req.params;
  var profile = await Profile.findById(id)
    .populate({
      path: "posts",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
        },
      },
    })
    .populate("author");
  if (profile != null) {
    try {
      profile.postsNo = profile.posts.length;
      res.render("profile/index.ejs", { profile });
    } catch (e) {
      if (req.isAuthenticated()) {
        res.redirect("friends/new");
      }
    }
  }
  var profile = await Profile.findOne({ username: req.user.username })
    .populate({
      path: "posts",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
        },
      },
    })
    .populate("author");
  try {
    profile.postsNo = profile.posts.length;
    res.render("profile/index.ejs", { profile });
  } catch (e) {
    if (req.isAuthenticated()) {
      res.redirect("friends/new");
    }
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("profile/new.ejs");
  // res.redirect(`/friends/${profile._id}`);
};

module.exports.addNewProfile = async (req, res) => {
  //  res.send(req.body.sub)
  const profile = new Profile(req.body.Profile);
  profile.username = req.user.username;
  profile.email = req.user.email;
  let result = await cloudinary.api.resources();

  let percent =0;
       
  result = result.resources.find((item) => item.secure_url === req.file.path)
  let dimension = +result.bytes
  // res.send(`${dimension}`)
 if(dimension>150000){
    percent = (100/(dimension/150000)).toFixed(0)
    if(percent<6)
    percent = 6;}
  else percent = 99;
  
  let array = req.file.path.split('upload');
  image=array[0]+`upload/q_${percent}`+array[1]


  profile.image.url = image;
  profile.image.filename = req.file.filename;

  const saved = await profile.save();
  console.log(saved);
  req.flash("sucess", "Sucessfully created your profile");
  // res.send(profile);
  res.render(`profile/index.ejs`, { profile });
};

module.exports.showProfile = async (req, res) => {
  const { id } = req.params;
  const profile = await Profile.findById(id)
    .populate({
      path: "posts",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
        },
      },
    })
    .populate("author");

  if (!profile) {
    console.log("nulled");
    req.flash("error", "Cannot find your profile register again");
    res.redirect("/register");
  } else {
    // res.send(req.user);
    res.render("profile/index.ejs", { profile });
  }
};

module.exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  // res.send(req.body.Profile);
  const profile_img = await Profile.findById(id);
  var profile = await Profile.findByIdAndUpdate(id, req.body.Profile, {
    runValidators: false,
    new: true,
  });

  try {
    console.log(req.file.path);
    cloudinary.uploader.destroy(profile_img.image.filename);
    profile.image.url = req.file.path;
    profile.image.filename = req.file.filename;
  } catch (e) {
    console.log("all set");
  }

  // if(req.body.deleteImages){

  //     for(let filename of req.body.deleteImages){
  //         await cloudinary.uploader.destroy(filename);
  //     }
  //     await room.updateOne({$pull:{image:{filename:{$in : req.body.deleteImages}}}})

  // }

  await profile.save();
  var profile = await Profile.findById(id)
    .populate({
      path: "posts",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
        },
      },
    })
    .populate("author");

  req.flash("sucess", "Sucessfully updated your profile");
  res.render(`profile/index.ejs`, { profile });
};

module.exports.renderEditForm = async (req, res) => {
  const x = await Profile.find({ username: { $regex: "a" } });
  console.log(
    "******************************************************************"
  );
  console.log(x);
  console.log(
    "******************************************************************"
  );

  const { id } = req.params;
  const profile = await Profile.findById(id)
    .populate({
      path: "posts",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
        },
      },
    })
    .populate("author");
  if (!profile) {
    console.log("nulled");
    req.flash("error", "Cannot find room");
    res.redirect("/room");
  } else {
    // res.send(profile);
    res.render("profile/edit.ejs", { profile });
  }
};
