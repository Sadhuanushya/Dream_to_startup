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
        console.log("from server",token,valid._id)
        res.status(200).json({token:token,userId:valid._id,role:valid.role});

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
UserCtrl.account=async(req,res)=>{
  try{
    const UserAccount=await User.findById(req.userId);
    
    if (!UserAccount) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profileData = { ...UserAccount.toObject() };

    // If user is entrepreneur, fetch their entrepreneur profile
    if (UserAccount.role === 'entrepreneur') {
      const Entrepreneur = require('../models/Entrepreneur-model');
      const entrepreneurProfile = await Entrepreneur.findOne({ userId: req.userId });
      if (entrepreneurProfile) {
        profileData.entrepreneurProfile = entrepreneurProfile;
      }
    }

    // If user is investor, fetch their investor profile
    if (UserAccount.role === 'investor') {
      const Investor = require('../models/Investor-model');
      const investorProfile = await Investor.findOne({ userId: req.userId });
      if (investorProfile) {
        profileData.investorProfile = investorProfile;
      }
    }

    res.json(profileData);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
}

UserCtrl.updateAccount = async(req, res) => {
  try {
    const { username, email, fullname, phone, address, city, state, country, pincode, bio } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (fullname) updateData.fullname = fullname;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (country) updateData.country = country;
    if (pincode) updateData.pincode = pincode;
    if (bio) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update account' });
  }
}

UserCtrl.getAllUsers = async(req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'Failed to fetch users'});
  }
}

UserCtrl.getStatistics = async(req, res) => {
  try {
    const Entrepreneur = require('../models/Entrepreneur-model');
    const Investor = require('../models/Investor-model');
    const Pitch = require('../models/Pitch-model');

    const totalUsers = await User.countDocuments();
    const totalEntrepreneurs = await Entrepreneur.countDocuments();
    const totalInvestors = await Investor.countDocuments();
    const totalPitches = await Pitch.countDocuments();
    const pendingVerifications = await Investor.countDocuments({ isVerified: false });

    res.status(200).json({
      totalUsers,
      totalEntrepreneurs,
      totalInvestors,
      totalPitches,
      pendingVerifications
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'Failed to fetch statistics'});
  }
}

module.exports=UserCtrl;