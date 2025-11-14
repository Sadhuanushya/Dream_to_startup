const mongoose =require('mongoose');
const addressSchema=new mongoose.Schema({
    address:String,
    city:String,
    state:String,
    country:String,
    pincode:Number
},{ _id: false })
const EducationSchema=mongoose.Schema({
    institutionName:String,
    course:String,
    year:Number
},{ _id: false })
const WorkExperienceItemSchema = new mongoose.Schema({
    company: String,
    position: String,
    years: Number,
},{ _id: false });
const PastProjectSchema=new mongoose.Schema({
    projectname:String,
    websiteUrl:String,
    revenue:Number
},{ _id: false })
DocumentSchema=new mongoose.Schema({
    DocumentUrl:String,
    Cloudinary_Id:String
})

const EntrepreneurSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    username:String,
    profilePicture:{
        type:DocumentSchema,
        default:{}
    },
    fullname:String,
    email:String,
    phone:String,
    address:{
        type:addressSchema,
        default:{}
    },
    bio:String,
    linkdinUrl:String,
    skills:{
        type:[String],
        default:[]
    },
    education:{
        type:[EducationSchema],
        default:[]
    },
    workExperience: {
        type: [WorkExperienceItemSchema],
        default: []
    },
    pastProject:{
        type:[PastProjectSchema],
        default:[]
    },
    identityDocument:{
        type:DocumentSchema,
        default:{}
    },
    BusinessRegistrationDocument:{
        type:DocumentSchema,
        default:{}
    },
    projectVideo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProjectVideo"
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const Entrepreneur=mongoose.model("Entrepreneur",EntrepreneurSchema)
module.exports= Entrepreneur;
 