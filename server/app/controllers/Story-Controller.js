const StoryDataValidation =require("../validations/Story-validation");
const Story = require("../models/Story-model");
const StoryCtrl={}
StoryCtrl.create=async(req,res)=>{
    try{
        const {title, description}=req.body;                        
        const {error}=StoryDataValidation.validate({title, description});
        if(error){
            return res.status(400).json({message:error.details[0].message})
        }       
        const newStory=new Story({title, description});
        await newStory.save();      
        res.status(201).json({message:"Story created successfully", story:{title, description}})
    }catch(err){
        console.error("Error creating story:", err);
        res.status(500).json({message:"Internal server error"})
    }       
}

StoryCtrl.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findByIdAndDelete(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res
      .status(200)
      .json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error("Error deleting story:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
StoryCtrl.getAll = async (req, res) => {
  try {
    const stories = await Story.find();;
    res.status(200).json(stories);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports=StoryCtrl;