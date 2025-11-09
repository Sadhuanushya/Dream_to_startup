const mongoose =require('mongoose')
const LocationSchema=new mongoose.Schema({
    address:String,
    city:String,
    state:String,
    country:String,
    pincode:String

})
const sectorSchema=mongoose.Schema({
    sector:String,
    description:String,
    targetInvestment:Number
})
const PastInvestmentSchema=new mongoose.Schema({
    projectName:String,
    investment:Number,
    investmentDocument:String
})
const InvesterSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    username:String,
    profilePicture:String,
    fullName:String,
    email:String,
    bio:String,
    linkedinUrl:String,
    officeLocation:{
        type:LocationSchema,
        default:{}
    },
    prefferedSector:{
        type:[sectorSchema],
        default:[]
    },
    pastInvestment:{
        type:[PastInvestmentSchema],
        default:[]
    },
    verificationDocument:String,
    isVerified:{
        type: Boolean,
        default:false
    }
},{timestamps:true})
const Invester=mongoose.model('Invester',InvesterSchema)
module.exports=Invester