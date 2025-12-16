const bcryptjs=require('bcryptjs');
const User=require('../models/Users-model')
const jwt=require('jsonwebtoken')
const nodemailer = require('nodemailer');
const {RegisterValidation,LoginValidation}=require('../validations/Users-validation')
const UserCtrl={};

//while user successfully register ,welcome email sent to registered mail id
const transporter=nodemailer.createTransport({
       
        host:process.env.SMT_HOST,
        port:process.env.SMT_PORT,
        secure:true,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
 })
 

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

    const mail = {
      from: process.env.EMAIL_USER, // sender email
      to: register.email, // receiver
      subject: "Welcome to Our Platform dream to startup🎉",
      html: `
        <h2>Hi ${register.fullname},</h2>
        <p>Thank you for registering with us!</p>
         <p>Welcome to Dream to Startup</p>
        <br/>
        <p>Regards,<br/>Team Support</p>
      `
    };

    transporter.sendMail(mail, (err, info) => {
      if (err) {
        console.error("Error sending mail:", err);
      } else {
        console.log("Mail sent:", info.response);
      }
    });

    res.status(201).json({
      message: "Registration successfull, Confirmation email sent.",
      user: register
    });
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
UserCtrl.account=async(req,res)=>{
  try{
    const UserAccount=await User.findById(req.userId);
    console.log(UserAccount);
    res.json(UserAccount)
    console.log(req.userId)

  }catch(err){
    console.log(err);
  }
}

module.exports=UserCtrl;