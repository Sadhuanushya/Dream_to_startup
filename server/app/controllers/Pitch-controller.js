const cloudinary=require("../utils/Cloudinary")
const PitchData=require("../models/Pitch-model")
const PitchSchema=require("../validations/Pitch-validation")
const fs=require("fs")
const PitchCtrl = {};

PitchCtrl.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

const {error,value}=PitchSchema.validate(req.body)
if(error){
  return res.status(400).json({error:error})
}
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "video",   
        folder: "Pitchs",
        public_id: req.file.filename,
        overwrite: true  
      }
    );
    fs.unlink(req.file.path, err => {
      if (err) console.error("Failed to remove local file:", err);
    });

const Pitch=new PitchData(value)
Pitch.pitchUrl=result.secure_url
Pitch.EnterprenuerId=req.userId
Pitch.cloudinaryId=result.public_id
await Pitch.save()
    return res.status(201).json({
      success: true,
      message: "Uploaded",
      // data: result
      PitchData:Pitch

    });

  } catch (err) {
    console.error("Upload error:", err);
    // return res.status(500).json({
    //   success: false,
    //   message: "Failed to upload",
    //   error: err.message
    // });
    return res.json(err)
  }
};
PitchCtrl.list=async(req,res)=>{
  try{
    const Pitchs=await PitchData.find().populate("EnterprenuerId","username")
    if(!Pitchs){
      return res.status(404).json({error:"record not found"})
    }
    res.status(200).json(Pitchs)
    console.log("Pitch list")

  }catch(err){
    res.status(500).json({error:err})
  }
}
PitchCtrl.listByUser=async(req,res)=>{
  const userId=req.params.id
  try{
    const Pitch=await PitchData.find({EnterprenuerId:userId}) 
    if(!Pitch){
      return res.status(404).json({error:err})
    }
    res.status(200).json(Pitch)

  }catch(err){
    res.status(500).json({error:err})
  }
}
PitchCtrl.update=async(req,res)=>{
  const id=req.params.id
    if(!req.file){
      return res.status(400).json({error:"Pitch not uploded"})
    }
  try{
    const Pitch=await PitchData.findById(id)
    if(!Pitch){
      return res.status(404).json({error:"Pitch not found"})
    }
    const {error,value}=PitchSchema.validate(req.body)
    console.log("checked body")
    console.log("cloudinarid",Pitch.cloudinaryId)
      if(error){
        return res.status(400).json({error:error})
      }
    console.log("file",req.file)

      console.log("cloudinarid",Pitch.cloudinaryId)

      await cloudinary.uploader.destroy(Pitch.cloudinaryId,{resource_type:"Pitch"});
      console.log("Pitch delete from cloudinary",Pitch.cloudinaryId)
     const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "video",   
        folder: "Pitchs",
        public_id: req.file.filename,
        overwrite: true  
      }
    );
      fs.unlink(req.file.path,err=>{
        if(err){
          console.log("failed to rermove local file")
        }
      });
      const updateData={...value}
      updateData.pitchUrl=result.secure_url;
      updateData.cloudinaryId=result.public_id;
      console.log("data created")
      const update=await PitchData.findByIdAndUpdate(id,updateData,{new:true});
      console.log("data updated")
      res.status(200).json({
        status:"successfully updated",
        data:update
      })
    

  }catch(err){
    res.status(500).json({error:err})
  }
}
PitchCtrl.delete = async (req, res) => {
  try {
    const pitch = await PitchData.findById(req.params.id);
    if (!pitch) {
      return res.status(404).json({ error: "Pitch not found" });
    }

    const isOwner = pitch.EnterprenuerId.toString() === req.userId.toString();
    const isAdmin = req.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this pitch" });
    }

    await cloudinary.uploader.destroy(pitch.cloudinaryId, {
      resource_type: "video",
    });

    await PitchData.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Pitch deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ error: "Server error deleting pitch" });
  }
};

module.exports = PitchCtrl;