const mongoose=require('mongoose');
const RegisterSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    clickcount:{
        type:Number,
        default:0
    },
    role:{
        type:String,
        default:'user'
    },
    lastLogin:{
        type:Date,
        default:null
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true});
const User=mongoose.model('User',RegisterSchema)
module.exports=User;