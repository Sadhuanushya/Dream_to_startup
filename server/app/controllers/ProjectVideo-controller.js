const cloudinary=require("../utils/Cloudinary")
const ProjectVideo=require("../models/ProjectVideo-model")
const ProjectVideoSchema=require("../validations/ProjectVideo-validation")
const fs=require("fs")
const VedioCtrl = {};

VedioCtrl.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

const {error,value}=ProjectVideoSchema.validate(req.body)
if(error){
  return res.status(400).json({error:error})
}
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "video",   
        folder: "videos",
        public_id: req.file.filename,
        overwrite: true  
      }
    );
    fs.unlink(req.file.path, err => {
      if (err) console.error("Failed to remove local file:", err);
    });

const video=new ProjectVideo(value)
video.videoUrl=result.secure_url
video.EnterprenuerId=req.userId
video.cloudinaryId=result.public_id
await video.save()
    return res.status(201).json({
      success: true,
      message: "Uploaded",
      // data: result
      videoData:video

    });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to upload",
      error: err.message
    });
  }
};
VedioCtrl.list=async(req,res)=>{
  try{
    const videos=await ProjectVideo.find()
    if(!videos){
      return res.status(404).json({error:"record not found"})
    }
    res.status(200).json(videos)

  }catch(err){
    res.status(500).json({error:err})
  }
}
VedioCtrl.listByUser=async(req,res)=>{
  const userId=req.params.id
  try{
    const video=await ProjectVideo.find({EnterprenuerId:userId}) 
    if(!video){
      return res.status(404).json({error:err})
    }
    res.status(200).json(video)

  }catch(err){
    res.status(500).json({error:err})
  }
}
VedioCtrl.update=async(req,res)=>{
  const id=req.params.id
    if(!req.file){
      return res.status(400).json({error:"video not uploded"})
    }
  try{
    const video=await ProjectVideo.findById(id)
    if(!video){
      return res.status(404).json({error:"video not found"})
    }
    const {error,value}=ProjectVideoSchema.validate(req.body)
    console.log("checked body")
    console.log("cloudinarid",video.cloudinaryId)
      if(error){
        return res.status(400).json({error:error})
      }
    console.log("file",req.file)

      console.log("cloudinarid",video.cloudinaryId)

      await cloudinary.uploader.destroy(video.cloudinaryId,{resource_type:"video"});
      console.log("video delete from cloudinary",video.cloudinaryId)
     const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "video",   
        folder: "videos",
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
      updateData.videoUrl=result.secure_url;
      updateData.cloudinaryId=result.public_id;
      console.log("data created")
      const update=await ProjectVideo.findByIdAndUpdate(id,updateData,{new:true});
      console.log("data updated")
      res.status(200).json({
        status:"successfully updated",
        data:update
      })
    

  }catch(err){
    res.status(500).json({error:err})
  }
}
VedioCtrl.delete=async(req,res)=>{
  try{
    const video=await ProjectVideo.findById(req.params.id);
    if(!video){
      return res.status(404).json({error:"record not found"})
    }
    console.log("before destroy")
    const RemoveVideo=await cloudinary.uploader.destroy(video.cloudinaryId,{resource_type:"video"})
    console.log("after destroy")
    const removeVideoData=await ProjectVideo.findByIdAndDelete(req.params.id)
    console.log("after update")
    res.status(200).json({
      status:"successfully deleted",
      RemoveVideo,
      removeVideoData
    })
  }catch(err){
    res.status(500).json({error:err})
  }
}
module.exports = VedioCtrl;