const jwt=require("jsonwebtoken")
const AthenticateUser=(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token){
        return res.status(401).json({error:"token not provided"})
    }
    try{
        const tokenData=jwt.verify(token,process.env.SECRET_KEY)
        console.log("tokenData",tokenData)

        req.userId=tokenData.userId
        req.role=tokenData.role
        next()
    }catch(err){
        res.status(401).json({error:"Invalid or expired token"})
    }
}
module.exports=AthenticateUser;