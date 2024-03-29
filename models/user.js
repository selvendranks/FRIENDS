const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({

    // username:{
    //     type:String,
    //     required:true
    // },
    email:{
        type:String,
        required:true,
        unique:true
    },
    token:{
        type:String,
        default : 'none'
    }
   
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',UserSchema);
module.exports = User;