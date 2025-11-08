console.log("Dream to Startup")
const express=require('express');
const app=express();
app.use(express.json());
require('dotenv').config();
const port=process.env.PORT;
const ConfigureDB=require('./config/db')
const AuthenticateUser=require('./app/middlewares/AuthenticateUser')
const AuthorizeUser=require('./app/middlewares/Authorizeuser')
const ctrl=require('./app/controllers/Users-controller')
const EntrepreneurCtrl=require("./app/controllers/Entrepreneur-Controller")
ConfigureDB()
// user register /login
app.post('/register',ctrl.register)
app.post('/login',ctrl.login);

//Entreprenuer
app.post('/EntrepreneurProfile',AuthenticateUser,AuthorizeUser(["entrepreneur"]),EntrepreneurCtrl.create)
app.get('/Entrepreneurs',AuthenticateUser,AuthorizeUser(["admin","invester"]),EntrepreneurCtrl.list)
app.get('/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),EntrepreneurCtrl.show)
app.put('/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.update)
app.delete('/Entreprenuer/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.delete)

app.listen(port,()=>{
    console.log('server running on the port',port)
})

