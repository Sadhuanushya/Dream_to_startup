console.log("Dream to Startup")
const express=require('express');
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const port=process.env.PORT;
const upload=require("./app/middlewares/Multer")
const uploadCtrl=require("./app/controllers/ProjectVideo-controller")
const ConfigureDB=require('./config/db')
const AuthenticateUser=require('./app/middlewares/AuthenticateUser')
const AuthorizeUser=require('./app/middlewares/Authorizeuser')
const UserCtrl=require('./app/controllers/Users-controller')
const EntrepreneurCtrl=require("./app/controllers/Entrepreneur-Controller")
const InvesterCtrl=require('./app/controllers/Invester-controller')
ConfigureDB()
app.post('/api/upload/video', upload.single('video'), uploadCtrl.create);
// user register /login
app.post('/register',UserCtrl.register)
app.post('/login',UserCtrl.login);

//Entreprenuer
app.post('/Entrepreneur',AuthenticateUser,AuthorizeUser(["entrepreneur"]),EntrepreneurCtrl.create)
app.get('/Entrepreneurs',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.list)
app.get('/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),EntrepreneurCtrl.show)
app.put('/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.update)
app.delete('/Entreprenuer/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.delete)

//invester
app.post('/Invester',AuthenticateUser,AuthorizeUser(["invester"]),InvesterCtrl.create)
app.get('/Investers',AuthenticateUser,AuthorizeUser(["admin","invester"]),InvesterCtrl.list)
app.get('/Invester/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),InvesterCtrl.show)
app.put('/Invester/:id',AuthenticateUser,AuthorizeUser(["invester","admin"]),InvesterCtrl.update)
app.delete('/Invester/:id',AuthenticateUser,AuthorizeUser(["admin","invester"]),InvesterCtrl.delete)
app.listen(port,()=>{
    console.log('server running on the port',port)
})

