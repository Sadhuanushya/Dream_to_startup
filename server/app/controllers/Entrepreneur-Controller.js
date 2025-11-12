const EnterPreneurValidation=require('../validations/Entrepreneur-validation')
const Entrepreneur=require('../models/Entrepreneur-model')
const cloudinary=require("../utils/Cloudinary")
const fs =require("fs")
const EntrepreneurCtrl={}
EntrepreneurCtrl.create=async(req,res)=>{
    try{
    const {error,value}=EnterPreneurValidation.validate(req.body)
    if(error){
        return res.status(400).json(error)
    }
    const existUsername=await Entrepreneur.findOne({username:value.username})
    if(existUsername){
        return res.status(400).json({error:"username not available"})
    }
    const existEmail=await Entrepreneur.findOne({email:value.email})
    if(existEmail){
        return res.status(400).json({error:"existing email"})
    }

let identityUpload = null;
let businessUpload = null;

if (req.files && req.files.identityDocument) {
  const file = req.files.identityDocument[0];
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "raw",
    folder: "documents/identity Document",
    public_id: file.filename,
    overwrite: true
  });
  fs.unlink(file.path, err => { if (err) console.error(err); });

  identityUpload = {
    EntrepreneurId: req.userId,
    DocumentUrl: result.secure_url,
    Cloudinary_Id: result.public_id
  };
}

if (req.files && req.files.businessDocument) {
  const file = req.files.businessDocument[0];
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "raw",
    folder: "documents/business document",
    public_id: file.filename,
    overwrite: true
  });
  fs.unlink(file.path, err => { if (err) console.error(err); });

  businessUpload = {
    EntrepreneurId: req.userId,
    DocumentUrl: result.secure_url,
    Cloudinary_Id: result.public_id
  };
}

const profileData = new Entrepreneur(value);
profileData.userId = req.userId;
profileData.EnterprenuerId = req.userId;

if (identityUpload) {
  profileData.identityDocument = identityUpload;
}
if (businessUpload) {
  profileData.BusinessRegistrationDocument = businessUpload;
}

await profileData.save();
res.status(201).json({
  success: true,
  message: "Uploaded",
  documentData: profileData
});

    }catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }
}
EntrepreneurCtrl.list=async(req,res)=>{
    try{
    const Entrepreneurs= await Entrepreneur.find().populate('projectVideo',['_id','videoUrl'])
    res.status(200).json(Entrepreneurs)
    }catch(err){

        res.status(500).json({error:err})
    }
}
EntrepreneurCtrl.show=async(req,res)=>{
    const id=req.params.id
    try{
        const EntrepreneurProfile=await Entrepreneur.findOne({_id:id}).populate('projectVideo',['_id','videoUrl'])
        if(!EntrepreneurProfile){
            return res.status(404).json("record not found")
        }
        res.status(200).json(EntrepreneurProfile)
    }
    catch(err){
        res.status(500).json(err)
    }
}
EntrepreneurCtrl.update=async(req,res)=>{
    const id=req.params.id
    try{
    const {error}=EnterPreneurValidation.validate(req.body)
    if(error){
        return res.status(400).json(error)
    }
    const profile=await Entrepreneur.findOne({_id:id})
        if(!profile){
            return  res.status(404).json("record not found")
        }
        console.log("id",profile.userId)
        
     const Admin = req.role === "admin" 
     const Entrepreneur = req.userId == profile.userId;
     if (!Admin && !Entrepreneur) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
        const EntrepreneurProfile =await Entrepreneur.findOneAndUpdate({_id:id},req.body,{new:true})
        if(!EntrepreneurProfile){
            return res.status(404).json("record not found")
        }
        res.status(200).json(EntrepreneurProfile)
    }catch(err){
        res.status(500).json(err)
    }
}
EntrepreneurCtrl.delete=async(req,res)=>{
    const id=req.params.id
    try{
     const profile=await Entrepreneur.findOne({_id:id})
        if(!profile){
            return  res.status(404).json("record not found")
        }
        console.log("id",profile.userId)
        
     const Admin = req.role === "admin" 
     const Entrepreneur = req.userId == profile.userId;
     if (!Admin && !Entrepreneur) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
        const EntrepreneurProfile=await Entrepreneur.findOneAndDelete({_id:id})
        if(!EntrepreneurProfile){
            return res.status(404).json("record not found")
        }
        res.status(200).json(EntrepreneurProfile)

    }catch(err){
        res.status(500).json(err)
    }
}
module.exports=EntrepreneurCtrl;