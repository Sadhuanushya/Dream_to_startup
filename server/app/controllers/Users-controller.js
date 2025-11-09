const bcryptjs=require('bcryptjs');
const User=require('../models/Users-model')
const jwt=require('jsonwebtoken')
const {RegisterValidation,LoginValidation}=require('../validations/Users-validation')
const UserCtrl={};
UserCtrl.register=async(req,res)=>{
    const body=req.body;
    const {error,value}=RegisterValidation.validate(body,{abortEarly:false})
    if(error){
        return res.status(400).json({error:error})
    }
    try{
    const existingEmail=await User.findOne({email:body.email})
    if(existingEmail){
        return res.status(400).json({error:'existing email'})
    }
    const register=new User(value);
    const salt=await bcryptjs.genSalt();
    const hash=await bcryptjs.hash(register.password,salt)
    register.password=hash;
    const count= await User.countDocuments();
    if(count==0){
        register.role="admin"
    }
    await register.save()
    res.status(201).json(register)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
UserCtrl.login=async(req,res)=>{
    const body=req.body;
    const{error,value}=LoginValidation.validate(body,{abortEarly:false})
    if(error){
        return res.status(400).json(error)
    }
    try{
        const valid= await User.findOne({email:value.email})
        if(!valid){
            return res.status(401).json('email invalid')
        }
        const passwordMatch=await bcryptjs.compare(value.password,valid.password)
        if(!passwordMatch){
            return res.status(401).json('invalid password')
        }
        const tokenData={userId:valid._id,role:valid.role}
        console.log(tokenData);
        const token=jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'7d'})

       
        valid.clickcount+=1;
        valid.lastLogin=new Date()
        await  valid.save()
        res.status(200).json({token:token})

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports=UserCtrl;