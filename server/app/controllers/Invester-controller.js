const InvesterValidation=require('../validations/Invester-validation')
const Invester=require('../models/Invester-model')
const InvesterCtrl={}
InvesterCtrl.create=async(req,res)=>{
    const {error,value}=InvesterValidation.validate(req.body)
    if(error){
        return res.status(400).json(error)
    }
    try{
    const ExistUsername=await Invester.findOne({username:value.username})
    if(ExistUsername){
        return res.status(400).json("username not available")
    }
    const Existemail=await Invester.findOne({email:value.email})
        if(Existemail){
           return  res.status(400).json({error:"An account with this email address already exists"})
        }
    const profile=new Invester(value)
    console.log("value",value,req.body)
    profile.userId=req.userId
    await profile.save()
    res.status(201).json(profile)
    }catch(err){
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
        const InvesterProfileUpdate =await Invester.findOneAndUpdate({_id:id},value,{new:true})

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
        const InvesterProfile=await Invester.findOneAndDelete({_id:id})
        res.status(200).json(InvesterProfile)
    }catch(err){
        res.status(500).json(err)
    }
}


module.exports=InvesterCtrl;