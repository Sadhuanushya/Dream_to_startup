const jwt=require("jsonwebtoken")
const AthenticateUser=(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token){
        res.status(401).json({err:"token not provided"})
    }
    try{
        const tokenData=jwt.verify(token,process.env.SECRET_KEY)
        console.log("tokenData",tokenData)

        req.userId=tokenData.userId
        req.role=tokenData.role
        // req.user = { userId: req.userId, role: req.role };
        next()
    }catch(err){
        res.status(401).json({error:err})
    }
}
module.exports=AthenticateUser;