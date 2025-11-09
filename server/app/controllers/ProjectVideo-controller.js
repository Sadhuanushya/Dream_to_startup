const cloudinary=require("../utils/Cloudinary")
const ProjectVideo=require("../models/ProjectVideo-model")
const ProjectVideoSchema=require("../validations/ProjectVideo-validation")
const fs=require("fs")
const uploadVedioCtrl = {};

uploadVedioCtrl.create = async (req, res) => {
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
await video.save()
    return res.status(200).json({
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

module.exports = uploadVedioCtrl;