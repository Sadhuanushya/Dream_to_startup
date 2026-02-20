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


EntrepreneurCtrl.update = async (req, res) => {
  const id = req.params.id;
console.log("its come to update")
  try {
    // Find existing profile
    const existing = await Entrepreneur.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "record not found" });
    }

    // Authorization
    const Admin = req.role === "admin";
    const Entrepreneurs = req.userId == existing.userId;
    if (!Admin && !Entrepreneurs) {
      return res.status(403).json({ error: "Unauthorized user" });
    }

    // Build parsedBody from FormData (direct mapping)
    const parsedBody = {};

    // Simple fields
    if (req.body.fullname) parsedBody.fullname = req.body.fullname;
    if (req.body.email) parsedBody.email = req.body.email;
    if (req.body.phone) parsedBody.phone = req.body.phone;
    if (req.body.bio) parsedBody.bio = req.body.bio;
    if (req.body.linkedinUrl)
      parsedBody.linkedinUrl = req.body.linkedinUrl;

    // Address
    parsedBody.address = {
      address: req.body["address[address]"] ?? existing.address?.address,
      city: req.body["address[city]"] ?? existing.address?.city,
      state: req.body["address[state]"] ?? existing.address?.state,
      country: req.body["address[country]"] ?? existing.address?.country,
      pincode: req.body["address[pincode]"] ?? existing.address?.pincode,
    };

    // Skills
    parsedBody.skills = [];
    Object.keys(req.body)
      .filter((key) => key.startsWith("skills["))
      .forEach((key) => {
        parsedBody.skills.push(req.body[key]);
      });

    // Education
    parsedBody.education = [];
    Object.keys(req.body)
      .filter((key) => key.startsWith("education"))
      .forEach((key) => {
        const match = key.match(/education\[(\d+)\]\[(.+)\]/);
        if (match) {
          const idx = parseInt(match[1]);
          const field = match[2];
          if (!parsedBody.education[idx]) {
            parsedBody.education[idx] = {};
          }
          parsedBody.education[idx][field] = req.body[key];
        }
      });

    // Work Experience
    parsedBody.workExperience = [];
    Object.keys(req.body)
      .filter((key) => key.startsWith("workExperience"))
      .forEach((key) => {
        const match = key.match(/workExperience\[(\d+)\]\[(.+)\]/);
        if (match) {
          const idx = parseInt(match[1]);
          const field = match[2];
          if (!parsedBody.workExperience[idx]) {
            parsedBody.workExperience[idx] = {};
          }
          parsedBody.workExperience[idx][field] = req.body[key];
        }
      });

    // Past Projects
    parsedBody.pastProject = [];
    Object.keys(req.body)
      .filter((key) => key.startsWith("pastProject"))
      .forEach((key) => {
        const match = key.match(/pastProject\[(\d+)\]\[(.+)\]/);
        if (match) {
          const idx = parseInt(match[1]);
          const field = match[2];
          if (!parsedBody.pastProject[idx]) {
            parsedBody.pastProject[idx] = {};
          }
          parsedBody.pastProject[idx][field] = req.body[key];
        }
      });

    // Validate
    const { error, value } = EnterPreneurValidation.validate(parsedBody);
    if (error) {
      return res.status(400).json(error);
    }

    // File uploads (Cloudinary)
    let uploadData = {};

    if (req.files && req.files.profilePicture) {
      // remove old
      if (existing.profilePicture?.Cloudinary_Id) {
        await cloudinary.uploader.destroy(
          existing.profilePicture.Cloudinary_Id,
          { resource_type: "auto" }
        );
      }
      const file = req.files.profilePicture[0];
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "entrepreneur/profilePictures",
        public_id: `profile_${Date.now()}`,
      });
      fs.unlinkSync(file.path);
      uploadData.profilePicture = {
        DocumentUrl: result.secure_url,
        Cloudinary_Id: result.public_id,
      };
    }

    if (req.files && req.files.identityDocument) {
      if (existing.identityDocument?.Cloudinary_Id) {
        await cloudinary.uploader.destroy(
          existing.identityDocument.Cloudinary_Id,
          { resource_type: "auto" }
        );
      }
      const file = req.files.identityDocument[0];
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "entrepreneur/identityDocuments",
        public_id: `identity_${Date.now()}`,
      });
      fs.unlinkSync(file.path);
      uploadData.identityDocument = {
        DocumentUrl: result.secure_url,
        Cloudinary_Id: result.public_id,
      };
    }

    if (req.files && req.files.BusinessRegistrationDocument) {
      if (existing.BusinessRegistrationDocument?.Cloudinary_Id) {
        await cloudinary.uploader.destroy(
          existing.BusinessRegistrationDocument.Cloudinary_Id,
          { resource_type: "auto" }
        );
      }
      const file = req.files.BusinessRegistrationDocument[0];
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: "entrepreneur/businessDocuments",
        public_id: `business_${Date.now()}`,
      });
      fs.unlinkSync(file.path);
      uploadData.BusinessRegistrationDocument = {
        DocumentUrl: result.secure_url,
        Cloudinary_Id: result.public_id,
      };
    }

    // Combine update
    const finalData = { ...value, ...uploadData };

    const updated = await Entrepreneur.findByIdAndUpdate(id, finalData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "record not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

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