const InvesterValidation=require('../validations/Invester-validation')
const Invester=require('../models/Invester-model')
const cloudinary=require("cloudinary");
const fs=require('fs');
const { profile } = require('console');
const InvesterCtrl={}
InvesterCtrl.create=async(req,res)=>{
console.log(req.body)
    try{
    const {error,value}=InvesterValidation.validate(req.body)
    if(error){
        return res.status(400).json(error)
    }
    const ExistUsername=await Invester.findOne({username:value.username})
    if(ExistUsername){
        return res.status(400).json("username not available")
    }
    const Existemail=await Invester.findOne({email:value.email})
        if(Existemail){
           return  res.status(400).json({error:"An account with this email address already exists"})
        }
    let documentUpload=null;
    let profileUpload=null;
    let pastInvestmentUpload=null;
    
    if (req.files && req.files.verificationDocument) {
      const file = req.files.verificationDocument[0];
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        folder: "invester document",
        public_id: file.filename,
        overwrite: true
      });
      fs.unlink(file.path, err => { if (err) console.error(err); });
    
      documentUpload = {
        DocumentUrl: result.secure_url,
        Cloudinary_Id: result.public_id
      };
    }
        if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture[0];
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        folder: "images",
        public_id: file.filename,
        overwrite: true
      });
      fs.unlink(file.path, err => { if (err) console.error(err); });
    
      profileUpload = {
        DocumentUrl: result.secure_url,
        Cloudinary_Id: result.public_id
      };
    }

    if (req.files && req.files.pastInvestment) {
      const file = req.files.pastInvestment[0];
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        folder: "invester document",
        public_id: file.filename,
        overwrite: true
      });
      fs.unlink(file.path, err => { if (err) console.error(err); });
        pastInvestmentUpload ={
          projectName: value.pastInvestment.projectName,
          investment: value.pastInvestment.investment,               
          investmentDocument: result.secure_url,
          Cloudinary_Id: result.public_id
        }
    }
    const profile=new Invester(value)
    console.log("value",value,req.body)
    profile.userId=req.userId
    if(documentUpload){
    profile.verificationDocument=documentUpload;
    }
    if(profileUpload){
    profile.profilePicture=profileUpload;
    }
    if(pastInvestmentUpload){
    profile.pastInvestment=pastInvestmentUpload
    }

    await profile.save()
    res.status(201).json(profile)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
InvesterCtrl.list=async(req,res)=>{
    try{
    const Investers= await Invester.find()
    res.status(200).json(Investers)
    }catch(err){
        res.status(500).json(err)
    }
}
InvesterCtrl.show=async(req,res)=>{
    const id=req.params.id
    try{
        const InvesterProfile=await Invester.findById({_id:id})
        if(!InvesterProfile){
           return res.status(404).json("record not found")
        }
        res.status(200).json(InvesterProfile)
    }
    catch(err){
        res.status(500).json(err)
    }
}
InvesterCtrl.update=async(req,res)=>{
    const id=req.params.id
    const {error,value}=await InvesterValidation.validate(req.body)
    if(error){
        return res.status(400).json(error)
    }
    try{
        const investerprofile=await Invester.findOne({_id:id})
        if(!investerprofile){
            return  res.status(404).json("record not found")
        }
        console.log("id",investerprofile.userId)
        
     const isAdmin = req.role === "admin" 
     const isOwner = req.userId == investerprofile.userId;
     if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
    let documentUpload=null;
    let profileUpload=null;
    let pastInvestmentUpload=null;
     if (req.files && req.files.profilePicture) {
        if(investerprofile.profilePicture?.Cloudinary_Id){
        await cloudinary.uploader.destroy(investerprofile.profilePicture.Cloudinary_Id,{resource_type:"raw"});
        console.log("profile picture delete from cloudinary")
        }
        const file = req.files.profilePicture[0];
         const result = await cloudinary.uploader.upload(file.path, {
             resource_type: "raw",
             folder: "images",
             public_id: file.filename,
             overwrite: true
        });
        fs.unlink(file.path, err => { if (err) console.error(err); });

         profileUpload = {
         DocumentUrl: result.secure_url,
         Cloudinary_Id: result.public_id
          };
console.log("profileupload",profileUpload)
     }
     if (req.files && req.files.verificationDocument) { 
        if(investerprofile.verificationDocument?.Cloudinary_Id){
        await cloudinary.uploader.destroy(investerprofile.verificationDocument.Cloudinary_Id,{resource_type:"raw"});
        console.log("business document delete from cloudinary")           
        }    

          const file = req.files.verificationDocument[0];
            const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "raw",
            folder: "invester document",
            public_id: file.filename,
            overwrite: true
  });
  fs.unlink(file.path, err => { if (err) console.error(err); });

    documentUpload = {
    DocumentUrl: result.secure_url,
    Cloudinary_Id: result.public_id
  };

     }


     if (req.files && req.files.pastInvestment) {
        if(investerprofile.pastInvestment?.Cloudinary_Id){
        await cloudinary.uploader.destroy(investerprofile.pastInvestment.Cloudinary_Id,{resource_type:"raw"});
        console.log("identity delete from cloudinary")
        }

        const file = req.files.pastInvestment[0];
        const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        folder: "invester document",
        public_id: file.filename,
        overwrite: true
     });
        fs.unlink(file.path, err => { if (err) console.error(err); });
console.log("result",result.secure_url)
         pastInvestmentUpload = {
         projectName: value.pastInvestment.projectName,
         investment: value.pastInvestment.investment, 
         investmentDocument: result.secure_url,
         Cloudinary_Id: result.public_id
  };
  console.log("result",result)
     }
      const updateData={...value}
      updateData.profilePicture=profileUpload;
      updateData.verificationDocument=documentUpload;
      updateData.pastInvestment=pastInvestmentUpload
      console.log("data created")
        const InvesterProfileUpdate =await Invester.findOneAndUpdate({_id:id},updateData,{new:true})

        res.status(200).json(InvesterProfileUpdate)
    }catch(err){
        res.status(500).json(err)
    }
}
InvesterCtrl.delete=async(req,res)=>{
    const id=req.params.id
    try{
     const investerprofile=await Invester.findOne({_id:id})
        if(!investerprofile){
            return  res.status(404).json("record not found")
        }
        console.log("id",investerprofile.userId)
        
     const isAdmin = req.role === "admin" 
     const isOwner = req.userId == investerprofile.userId;
     if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
    if (investerprofile.profilePicture.Cloudinary_Id) {
        await cloudinary.uploader.destroy(investerprofile.profilePicture.Cloudinary_Id,{resource_type:"raw"});
        console.log("profile picture delete from cloudinary")
      }
    if (investerprofile.verificationDocument.Cloudinary_Id) {
        await cloudinary.uploader.destroy(investerprofile.verificationDocument.Cloudinary_Id,{resource_type:"raw"});
        console.log("verification delete from cloudinary")
      }

    if (investerprofile.pastInvestment.Cloudinary_Id) {
        await cloudinary.uploader.destroy(investerprofile.pastInvestment.Cloudinary_Id,{resource_type:"raw"});
        console.log("past investment delete from cloudinary")
      }
        const InvesterProfile=await Invester.findOneAndDelete({_id:id})
        res.status(200).json(InvesterProfile)
    }catch(err){
        res.status(500).json(err)
    }
}


module.exports=InvesterCtrl;