const User = require("../models/user");
const Room = require("../models/profile");
const Profile = require("../models/profile");
const Post = require("../models/posts");
const requestImageSize = require('request-image-size');
const { cloudinary } = require("../cloudinary");


module.exports.findPeople = async (req, res) => {
  // res.send(req.params);
  const profile = await Profile.findOne({ username: req.user.username })
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
  res.render("friends/new.ejs", { profile });
};

module.exports.showPeople = async (req, res) => {
  const pattern = req.query.search;
  const profiles = await Profile.find({ username: { $regex: pattern } });
  console.log(
    "******************************************************************"
  );
  console.log(profiles);

  // let profiles = []
  // for(let i of profileS){
  //   profiles.unshift(i);
  // }
  console.log(
    "******************************************************************"
  );

  const profile = await Profile.findOne({ username: req.user.username })
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
  res.render("friends/find.ejs", { profile, profiles });
};

module.exports.viewPeople = async (req, res) => {
  // res.send(req.params);
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
  res.render("profile/index.ejs", { profile });
};

module.exports.addPeople = async (req, res) => {
  const { id } = req.params;
  const profile = await Profile.findById(id);
  if (profile.friendRequest.indexOf(req.user.username) < 0) {
    profile.friendRequest.push(req.user.username);
    profile.save();
  }
  req.flash("sucess", "friend request sent");
  // res.redirect(`/friends/${req.user._id}/yourfriends/new`);
  res.redirect(req.session.refresh);
};

module.exports.friendRequest = async (req, res) => {
  const profile = await Profile.findOne({ username: req.user.username });

  const friendRequests = [];
  if (profile.friendRequest.length > 0) {
    for (prof of profile.friendRequest) {
      var requests = await Profile.findOne({ username: prof });
      friendRequests.unshift(requests);
    }
  }

  res.render("friends/friendreq.ejs", { friendRequests });
  // res.render(friendRequests);
};

module.exports.decision = async (req, res) => {
  const { id } = req.params;

  const decision = req.query.decision;
  // console.log(decision);
  const profile = await Profile.findOne({ username: req.user.username });
  const friend = await Profile.findOne({ username: id });

  if (
    decision == "accept" &&
    profile.friends.indexOf(id) < 0 &&
    friend.friends.indexOf(req.user.username) < 0
  ) {
    profile.friends.push(id);
    friend.friends.push(req.user.username);

    var index = profile.friendRequest.indexOf(id);
    if (index > -1) {
      profile.friendRequest.splice(index, 1);
    }

    var index = friend.friendRequest.indexOf(req.user.username);
    if (index > -1) {
      friend.friendRequest.splice(index, 1);
    }

    friend.save();
    profile.save();
    console.log("************************");
    console.log(profile);
    req.flash("sucess", "Accepted friend request");
    res.redirect(`/friends/${req.user._id}/yourfriends/friendRequest`);
  } else {
    var index = profile.friendRequest.indexOf(id);
    if (index > -1) {
      profile.friendRequest.splice(index, 1);
      profile.save();
      req.flash("error", "rejected friend request");
      res.redirect(`/friends/${req.user._id}/yourfriends/friendRequest`);
    }
  }
};

module.exports.showFriends = async (req, res) => {
  const profile = await Profile.findOne({ username: req.user.username });

  let friends = [];
  if (profile.friends.length > 0) {
    for (prof of profile.friends) {
      var buddies = await Profile.findOne({ username: prof });
      friends.unshift(buddies);
    }
  }
  
  // res.send(friends)
  res.render("friends/friends.ejs",  {friends} );
};

module.exports.removeFriends = async (req, res) => {
  const { id } = req.params;
  const profile = await Profile.findOne({ username: req.user.username });
  const friend = await Profile.findById(id);

  var index = profile.friends.indexOf(friend.username);
  if (index > -1) {
    profile.friends.splice(index, 1);
  }

  var index = friend.friends.indexOf(req.user.username);
  if (index > -1) {
    friend.friends.splice(index, 1);
  }

  friend.save();
  profile.save();
  res.redirect(`/friends/${req.user._id}/yourfriends`);
};

module.exports.seefeeds = async (req, res) => {
  ///////////////////////////////funciton to shuffle list

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  ////////////////////////////////searching friends
  const yourprofile = await Profile.findOne({ username: req.user.username });
  const friends = yourprofile.friends;

  ///////////////////////////////searching for public accounts
  const publicprofile = await Profile.find({ visibilty: "public" });
  const publicaccount = publicprofile.map((x) => x.username);

  //////////////////////////////combining the usernames for feed and remove duplicates

  const feedProfile = [...new Set(friends.concat(publicaccount))];
  const index = feedProfile.indexOf(req.user.username);
  if (index > -1) {
    feedProfile.splice(index, 1); // 2nd parameter means remove one item only
  }

  var profile = await Profile.find({ username: { $in: feedProfile } })
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
  console.log(profile);

  profile = shuffle(profile);
  
  res.render('friends/feeds.ejs',{Profile : profile})
};

