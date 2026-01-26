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
    const existEmail=await Entrepreneur.findOne({email:value.email})
    if(existEmail){
        return res.status(400).json({error:"existing email"})
    }

let identityUpload = null;
let businessUpload = null;
let profileUpload=null;

if (req.files && req.files.profilePicture) {
  const file = req.files.profilePicture[0];
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "auto",
    folder: "entrepreneur/profilePictures",
    public_id: `profile_${Date.now()}`,
    overwrite: true
  });
  fs.unlink(file.path, err => { if (err) console.error(err); });

  profileUpload = {
    DocumentUrl: result.secure_url,
    Cloudinary_Id: result.public_id
  };
}


if (req.files && req.files.identityDocument) {
  const file = req.files.identityDocument[0];
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "auto",
    folder: "entrepreneur/identityDocuments",
    public_id: `identity_${Date.now()}`,
    overwrite: true
  });
  fs.unlink(file.path, err => { if (err) console.error(err); });

  identityUpload = {
    DocumentUrl: result.secure_url,
    Cloudinary_Id: result.public_id
  };
}

if (req.files && req.files.BusinessRegistrationDocument) {
  const file = req.files.BusinessRegistrationDocument[0];
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "auto",
    folder: "entrepreneur/businessDocuments",
    public_id: `business_${Date.now()}`,
    overwrite: true
  });
  fs.unlink(file.path, err => { if (err) console.error(err); });

  businessUpload = {
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
if (profileUpload) {
  profileData.profilePicture = profileUpload;
}
if (businessUpload) {
  profileData.BusinessRegistrationDocument = businessUpload;
}

await profileData.save();
res.status(201).json({
  success: true,
  message: "Profile uploaded successfully with documents",
  documentData: profileData
});

    }catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }
}
EntrepreneurCtrl.list=async(req,res)=>{
    try{
    const Entrepreneurs= await Entrepreneur.find().populate('userId', 'username email role').populate('PitchData',['_id','pitchUrl'])
    res.status(200).json(Entrepreneurs)
    console.log(Entrepreneurs)
    }catch(err){

        res.status(500).json({error:err})
    }
}
EntrepreneurCtrl.show=async(req,res)=>{
    const id=req.params.id
    try{
        const EntrepreneurProfile=await Entrepreneur.findOne({userId:id}).populate('PitchData',['_id','pitchUrl'])
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
    const id=req.params.id;
    try{
    // Parse JSON fields from FormData
    let parsedBody = { ...req.body };
    
    if (req.body.address) {
      parsedBody.address = JSON.parse(req.body.address);
    }
    if (req.body.skills) {
      parsedBody.skills = JSON.parse(req.body.skills);
    }
    if (req.body.education) {
      parsedBody.education = JSON.parse(req.body.education);
    }
    if (req.body.workExperience) {
      parsedBody.workExperience = JSON.parse(req.body.workExperience);
    }
    if (req.body.pastProject) {
      parsedBody.pastProject = JSON.parse(req.body.pastProject);
    }

    const {error,value}=EnterPreneurValidation.validate(parsedBody)
    if(error){
        return res.status(400).json(error)
    }
    
    const profile=await Entrepreneur.findById(id)
        if(!profile){
            return  res.status(404).json("record not found")
        }
        console.log("id",profile.userId)
        
     const Admin = req.role === "admin" 
     const Entrepreneurs = req.userId == profile.userId;
     if (!Admin && !Entrepreneurs) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
     let profilePicture={};
     let identityDocument={};
     let businessDocument={};
     if (req.files && req.files.profilePicture) {
        if(profile.profilePicture?.Cloudinary_Id){
        await cloudinary.uploader.destroy(profile.profilePicture.Cloudinary_Id,{resource_type:"auto"});
        console.log("profile picture delete from cloudinary")
        }
        const file = req.files.profilePicture[0];
         const result = await cloudinary.uploader.upload(file.path, {
             resource_type: "auto",
             folder: "entrepreneur/profilePictures",
             public_id: `profile_${Date.now()}`,
             overwrite: true
        });
        fs.unlink(file.path, err => { if (err) console.error(err); });

         profilePicture = {
         DocumentUrl: result.secure_url,
         Cloudinary_Id: result.public_id
          };

     }
     if (req.files && req.files.BusinessRegistrationDocument) { 
        if(profile.BusinessRegistrationDocument?.Cloudinary_Id){
        await cloudinary.uploader.destroy(profile.BusinessRegistrationDocument.Cloudinary_Id,{resource_type:"auto"});
        console.log("business document delete from cloudinary")           
        }    

          const file = req.files.BusinessRegistrationDocument[0];
            const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "entrepreneur/businessDocuments",
            public_id: `business_${Date.now()}`,
            overwrite: true
  });
  fs.unlink(file.path, err => { if (err) console.error(err); });

    businessDocument = {
    DocumentUrl: result.secure_url,
    Cloudinary_Id: result.public_id
  };

     }
     if (req.files && req.files.identityDocument) {
        if(profile.identityDocument?.Cloudinary_Id){
        await cloudinary.uploader.destroy(profile.identityDocument.Cloudinary_Id,{resource_type:"auto"});
        console.log("identity delete from cloudinary")
        }

        const file = req.files.identityDocument[0];
        const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "entrepreneur/identityDocuments",
        public_id: `identity_${Date.now()}`,
        overwrite: true
     });
        fs.unlink(file.path, err => { if (err) console.error(err); });

         identityDocument = {
         DocumentUrl: result.secure_url,
         Cloudinary_Id: result.public_id
  };
     }
      const updateData={...value}
      if(Object.keys(profilePicture).length > 0) updateData.profilePicture=profilePicture;
      if(Object.keys(businessDocument).length > 0) updateData.BusinessRegistrationDocument=businessDocument;
      if(Object.keys(identityDocument).length > 0) updateData.identityDocument=identityDocument;
      console.log("data created")

        const EntrepreneurProfile =await Entrepreneur.findOneAndUpdate({_id:id},updateData,{new:true})
        if(!EntrepreneurProfile){
            return res.status(404).json("record not found")
        }
        res.status(200).json(EntrepreneurProfile)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}
EntrepreneurCtrl.delete=async(req,res)=>{
    console.log("before id")
    const id=req.params.id
    try{
        console.log("before profile find")
        const profile=await Entrepreneur.findById(id)
        if(!profile){
            return  res.status(404).json("record not found")
        }
         console.log("id",profile.identityDocument?.Cloudinary_Id)  
     const Admin = req.role === "admin" 
     const Entrepreneurs = req.userId == profile.userId;
     if (!Admin && !Entrepreneurs) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
          if (profile.profilePicture?.Cloudinary_Id) {
           await cloudinary.uploader.destroy(profile.profilePicture.Cloudinary_Id,{resource_type:"auto"});
           console.log("profile pictire delete from cloudinary")

          }
          if (profile.BusinessRegistrationDocument?.Cloudinary_Id) {
                  await cloudinary.uploader.destroy(profile.BusinessRegistrationDocument.Cloudinary_Id,{resource_type:"auto"});
                  console.log("BusinessRegistrationDocument delete from cloudinary")

          }         
          if (profile.identityDocument?.Cloudinary_Id) {
                 await cloudinary.uploader.destroy(profile.identityDocument.Cloudinary_Id,{resource_type:"auto"});
                  console.log("identityDocument delete from cloudinary")
          }    
        const EntrepreneurProfile=await Entrepreneur.findOneAndDelete({_id:id})
        if(!EntrepreneurProfile){
            return res.status(404).json("record not found")
        }
        res.status(200).json(EntrepreneurProfile)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
module.exports=EntrepreneurCtrl;