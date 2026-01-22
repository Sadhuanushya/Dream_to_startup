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
    investmentDocument:String,
    Cloudinary_Id:String,
})
const DocumentSchema=new mongoose.Schema({
    DocumentUrl:String,
    Cloudinary_Id:String
})
const InvestorSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    profilePicture:{
        type:DocumentSchema,
        default:{}
    },
    fullName:String,
    email:String,
    bio:String,
    linkedinUrl:String,
    investorType:{
        type:String,
        enum:['Angel Investor','Accelerator Investor','Seed Investor','Other']
    },
    customInvestorType:String,
    officeLocation:{
        type:LocationSchema,
        default:{}
    },
    prefferedSector:{
        type:[sectorSchema],
        default:[]
    },
    pastInvestment:{
        type:PastInvestmentSchema,
        default:{}
    },
    verificationDocument:{
        type:DocumentSchema,
        default:{}
    },
    isVerified:{
        type: Boolean,
        default:false
    },
},{timestamps:true})
const Investor=mongoose.model('Investor',InvestorSchema)
module.exports=Investor