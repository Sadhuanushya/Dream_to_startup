const InvestorValidation=require('../validations/Investor-validation')
const Investor=require('../models/Investor-model')
const cloudinary=require("cloudinary");
const fs=require('fs');

const InvestorCtrl={}
InvestorCtrl.create=async(req,res)=>{
console.log(req.body)
    try{
    const {error,value}=InvestorValidation.validate(req.body)
    if(error){
        return res.status(400).json(error)
    }
    const ExistUsername=await Investor.findOne({username:value.username})
    if(ExistUsername){
        return res.status(400).json("username not available")
    }
    const Existemail=await Investor.findOne({email:value.email})
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
        folder: "Investor document",
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
        folder: "Investor document",
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
    const profile=new Investor(value)
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
InvestorCtrl.list=async(req,res)=>{
    try{
    const Investors= await Investor.find()
    res.status(200).json(Investors)
    }catch(err){
        res.status(500).json(err)
    }
}
InvestorCtrl.show=async(req,res)=>{
    const id=req.params.id
    try{
        const InvestorProfile=await Investor.findById({_id:id})
        if(!InvestorProfile){
           return res.status(404).json("record not found")
        }
        res.status(200).json(InvestorProfile)
    }
    catch(err){
        res.status(500).json(err)
    }
}
InvestorCtrl.update=async(req,res)=>{
    const id=req.params.id
    const {error,value}=await InvestorValidation.validate(req.body)
    if(error){
        return res.status(400).json(error)
    }
    try{
        const Investorprofile=await Investor.findOne({_id:id})
        if(!Investorprofile){
            return  res.status(404).json("record not found")
        }
        console.log("id",Investorprofile.userId)
        
     const isAdmin = req.role === "admin" 
     const isOwner = req.userId == Investorprofile.userId;
     if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
    let documentUpload=null;
    let profileUpload=null;
    let pastInvestmentUpload=null;
     if (req.files && req.files.profilePicture) {
        if(Investorprofile.profilePicture?.Cloudinary_Id){
        await cloudinary.uploader.destroy(Investorprofile.profilePicture.Cloudinary_Id,{resource_type:"raw"});
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
        if(Investorprofile.verificationDocument?.Cloudinary_Id){
        await cloudinary.uploader.destroy(Investorprofile.verificationDocument.Cloudinary_Id,{resource_type:"raw"});
        console.log("business document delete from cloudinary")           
        }    

          const file = req.files.verificationDocument[0];
            const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "raw",
            folder: "Investor document",
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
        if(Investorprofile.pastInvestment?.Cloudinary_Id){
        await cloudinary.uploader.destroy(Investorprofile.pastInvestment.Cloudinary_Id,{resource_type:"raw"});
        console.log("identity delete from cloudinary")
        }

        const file = req.files.pastInvestment[0];
        const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        folder: "Investor document",
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
        const InvestorProfileUpdate =await Investor.findOneAndUpdate({_id:id},updateData,{new:true})

        res.status(200).json(InvestorProfileUpdate)
    }catch(err){
        res.status(500).json(err)
    }
}
InvestorCtrl.delete=async(req,res)=>{
    const id=req.params.id
    try{
     const Investorprofile=await Investor.findOne({_id:id})
        if(!Investorprofile){
            return  res.status(404).json("record not found")
        }
        console.log("id",Investorprofile.userId)
        
     const isAdmin = req.role === "admin" 
     const isOwner = req.userId == Investorprofile.userId;
     if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Unauthorized user" });
     }
    if (Investorprofile.profilePicture.Cloudinary_Id) {
        await cloudinary.uploader.destroy(Investorprofile.profilePicture.Cloudinary_Id,{resource_type:"raw"});
        console.log("profile picture delete from cloudinary")
      }
    if (Investorprofile.verificationDocument.Cloudinary_Id) {
        await cloudinary.uploader.destroy(Investorprofile.verificationDocument.Cloudinary_Id,{resource_type:"raw"});
        console.log("verification delete from cloudinary")
      }

    if (Investorprofile.pastInvestment.Cloudinary_Id) {
        await cloudinary.uploader.destroy(Investorprofile.pastInvestment.Cloudinary_Id,{resource_type:"raw"});
        console.log("past investment delete from cloudinary")
      }
        const InvestorProfile=await Investor.findOneAndDelete({_id:id})
        res.status(200).json(InvestorProfile)
    }catch(err){
        res.status(500).json(err)
    }
}


module.exports=InvestorCtrl;