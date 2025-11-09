const EnterPreneurValidation=require('../validations/Entrepreneur-validation')
const Entrepreneur=require('../models/Entrepreneur-model')
const EntrepreneurCtrl={}
EntrepreneurCtrl.create=async(req,res)=>{
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

    try{
    const profiledata=new Entrepreneur(value)
    console.log("value",value,req.body)
    profiledata.userId=req.userId
    await profiledata.save()
    res.status(201).json(profiledata)
    }catch(err){
        res.status(500).json(err)
    }

}
EntrepreneurCtrl.list=async(req,res)=>{
    try{
    const Entrepreneurs= await Entrepreneur.find()
    res.status(200).json(Entrepreneurs)
    }catch(err){

        res.status(500).json(err)
    }
}
EntrepreneurCtrl.show=async(req,res)=>{
    const id=req.params.id
    try{
        const EntrepreneurProfile=await Entrepreneur.findOne({_id:id})
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