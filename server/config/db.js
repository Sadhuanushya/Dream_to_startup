const mongoose=require('mongoose');
async function ConfigureDB(){
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('server connected to the DB')

    }catch(err){
        console.log("server error to connecting DB",err.message);
    }

}
module.exports=ConfigureDB;