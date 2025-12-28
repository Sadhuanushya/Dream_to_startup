console.log("Dream to Startup")

const express=require('express');

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const cors = require("cors");
app.use(cors());
const ConfigureDB=require('./config/db')
ConfigureDB()
const port=process.env.PORT;
//middlewares
const AuthenticateUser=require('./app/middlewares/AuthenticateUser')
const AuthorizeUser=require('./app/middlewares/Authorizeuser')
const {EntrepreneurUploads,InvesterUploads} =require("./app/middlewares/UploadConfig")
const upload=require('./app/middlewares/Multer')

//controllers
const VedioCtrl=require("./app/controllers/ProjectVideo-controller")
const MessageController =require('./app/controllers/Message-controller');
const UserCtrl=require('./app/controllers/Users-controller')
const EntrepreneurCtrl=require("./app/controllers/Entrepreneur-Controller")
const InvesterCtrl=require('./app/controllers/Investor-controller')
const PaymentCtrl=require("./app/controllers/Payment-Controller");
const AiReviewCtrl=require('./app/controllers/AiReview-controller')



app.post("/get-review", AiReviewCtrl.getResponse);
app.post("/payment/process",PaymentCtrl.pay)
// user register /login
app.post('/api/register',UserCtrl.register)
app.post('/api/login',UserCtrl.login);
app.get('/api/account',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","investor"]),UserCtrl.account)
//Entreprenuer
app.post('/api/Entrepreneur',AuthenticateUser,AuthorizeUser(["entrepreneur"]),EntrepreneurUploads,EntrepreneurCtrl.create)
app.get('/api/Entrepreneurs',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.list)
app.get('/api/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","investor"]),EntrepreneurCtrl.show)
app.put('/api/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurUploads,EntrepreneurCtrl.update)
app.delete('/api/Entreprenuer/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.delete)

//invester
app.post('/api/Investor',AuthenticateUser,AuthorizeUser(["investor","user"]),InvesterUploads,InvesterCtrl.create)
app.get('/api/Investors',AuthenticateUser,AuthorizeUser(["admin","investor"]),InvesterCtrl.list)
app.get('/api/Investor/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","investor"]),InvesterCtrl.show)
app.put('/api/Investor/:id',AuthenticateUser,AuthorizeUser(["investor","admin"]),InvesterUploads,InvesterCtrl.update)
app.delete('/api/Investor/:id',AuthenticateUser,AuthorizeUser(["admin","investor"]),InvesterCtrl.delete)

//video upload
app.post('/api/video',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]), upload.single('video'), VedioCtrl.create);
app.get('/api/videos',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","investor"]),VedioCtrl.list);
app.get('/api/videos/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","investor"]),VedioCtrl.listByUser);
app.put('/api/video/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]), upload.single('video'), VedioCtrl.update); 
app.delete('/api/video/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]),VedioCtrl.delete);

app.post("/api/messages/add", MessageController.addMessage); 
app.get("/api/messages/get", MessageController.getAllMessage);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});