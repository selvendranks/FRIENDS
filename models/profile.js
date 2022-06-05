const mongoose = require('mongoose');
const Shema = mongoose.Schema;



const profileSchema = new Shema({ 
   
   username:{
       type:String
   },
   email:{
       type:String
   },
    description:{
      type:  String,
      require:true
    },
    email:{
       type: String,
       require:true
    },
    Gender:{
      type:String,
      require: true
    },
    image:{
        url:String,
        filename:String
    },
   
    visibilty:{
      type:String
    },
    dateOfBirth:{
      type:String,
      default:0
    },
    friends:[{
      type:String
    }],
    friendRequest:[{
      type:String
    }],
    author:{
         type:mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    posts:[{type:Shema.Types.ObjectId,ref : 'Post'}]
  

})

const Profile= mongoose.model("Profile",profileSchema);
module.exports = Profile;