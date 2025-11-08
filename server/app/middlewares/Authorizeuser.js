const AuthorizeUser=(roles)=>{
    return(req,res,next)=>{
        if(roles.includes(req.role)){
            next()
        }else{
            res.status(401).json({err:"unAuthorized"})
        }
    }
}
module.exports=AuthorizeUser;