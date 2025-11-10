console.log("Dream to Startup")
const express=require('express');
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const port=process.env.PORT;
const upload = require("./app/middlewares/Multer")
const VedioCtrl=require("./app/controllers/ProjectVideo-controller")
const ConfigureDB=require('./config/db')
const AuthenticateUser=require('./app/middlewares/AuthenticateUser')
const AuthorizeUser=require('./app/middlewares/Authorizeuser')
const UserCtrl=require('./app/controllers/Users-controller')
const EntrepreneurCtrl=require("./app/controllers/Entrepreneur-Controller")
const InvesterCtrl=require('./app/controllers/Invester-controller')
ConfigureDB()

// user register /login
app.post('/api/register',UserCtrl.register)
app.post('/api/login',UserCtrl.login);

//Entreprenuer
app.post('/api/Entrepreneur',AuthenticateUser,AuthorizeUser(["entrepreneur"]),EntrepreneurCtrl.create)
app.get('/api/Entrepreneurs',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.list)
app.get('/api/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),EntrepreneurCtrl.show)
app.put('/api/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.update)
app.delete('/api/Entreprenuer/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.delete)

//invester
app.post('/api/Invester',AuthenticateUser,AuthorizeUser(["invester"]),InvesterCtrl.create)
app.get('/api/Investers',AuthenticateUser,AuthorizeUser(["admin","invester"]),InvesterCtrl.list)
app.get('/api/Invester/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),InvesterCtrl.show)
app.put('/api/Invester/:id',AuthenticateUser,AuthorizeUser(["invester","admin"]),InvesterCtrl.update)
app.delete('/api/Invester/:id',AuthenticateUser,AuthorizeUser(["admin","invester"]),InvesterCtrl.delete)

//video upload
app.post('/api/video',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]), upload.single('video'), VedioCtrl.create);
app.get('/api/videos',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),VedioCtrl.list);
app.get('/api/videos/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),VedioCtrl.listByUser);
app.put('/api/video/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]), upload.single('video'), VedioCtrl.update);
app.delete('/api/video/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]),VedioCtrl.delete);



app.listen(port,()=>{
    console.log('server running on the port',port)
})

