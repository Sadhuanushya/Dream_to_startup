console.log("Dream to Startup")

const express=require('express');

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();

const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3080",
//   credentials: true
// }));
const port=process.env.PORT;
const upload = require("./app/middlewares/Multer")
const VedioCtrl=require("./app/controllers/ProjectVideo-controller")
const ConfigureDB=require('./config/db')
const MessageController =require('./app/controllers/Message-controller');
const AuthenticateUser=require('./app/middlewares/AuthenticateUser')
const AuthorizeUser=require('./app/middlewares/Authorizeuser')
const UserCtrl=require('./app/controllers/Users-controller')
const EntrepreneurCtrl=require("./app/controllers/Entrepreneur-Controller")
const InvesterCtrl=require('./app/controllers/Investor-controller')
const PaymentCtrl=require("./app/controllers/Payment-Controller");
ConfigureDB()
const Ai=require('./app/controllers/Ai')
app.post("/get-review", Ai.getResponse);

app.post("/payment/process",PaymentCtrl.pay)
// user register /login
app.post('/api/register',UserCtrl.register)
app.post('/api/login',UserCtrl.login);

//Entreprenuer
app.post('/api/Entrepreneur',AuthenticateUser,AuthorizeUser(["entrepreneur"]),  upload.fields([
    { name: 'identityDocument', maxCount: 1 },
    { name: 'BusinessRegistrationDocument', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
  ]),EntrepreneurCtrl.create)
app.get('/api/Entrepreneurs',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.list)
app.get('/api/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),EntrepreneurCtrl.show)
app.put('/api/Entrepreneur/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),
upload.fields([
    { name: 'identityDocument', maxCount: 1 },
    { name: 'BusinessRegistrationDocument', maxCount: 1 },
    { name: 'verificationDocument', maxCount: 1 }
  ])
,EntrepreneurCtrl.update)
app.delete('/api/Entreprenuer/:id',AuthenticateUser,AuthorizeUser(["admin","entrepreneur"]),EntrepreneurCtrl.delete)

//invester
app.post('/api/Invester',AuthenticateUser,AuthorizeUser(["invester","user"]),upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'pastInvestment', maxCount: 3},
    { name: 'verificationDocument', maxCount: 1 }
  ]),InvesterCtrl.create)
app.get('/api/Investers',AuthenticateUser,AuthorizeUser(["admin","invester"]),InvesterCtrl.list)
app.get('/api/Invester/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),InvesterCtrl.show)
app.put('/api/Invester/:id',AuthenticateUser,AuthorizeUser(["invester","admin"]),upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'pastInvestment', maxCount: 3},
    { name: 'verificationDocument', maxCount: 1 }
  ]),InvesterCtrl.update)
app.delete('/api/Invester/:id',AuthenticateUser,AuthorizeUser(["admin","invester"]),InvesterCtrl.delete)

//video upload
app.post('/api/video',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]), upload.single('video'), VedioCtrl.create);
app.get('/api/videos',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),VedioCtrl.list);
app.get('/api/videos/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin","invester"]),VedioCtrl.listByUser);
app.put('/api/video/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]), upload.single('video'), VedioCtrl.update); 
app.delete('/api/video/:id',AuthenticateUser,AuthorizeUser(["entrepreneur","admin"]),VedioCtrl.delete);

app.post("/api/messages/add", MessageController.addMessage); 
app.get("/api/messages/get", MessageController.getAllMessage);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(" New socket connection:", socket.id);

  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    console.log("User added:", userId, "socketId:", socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    for (const [userId, sockId] of global.onlineUsers) {
      if (sockId === socket.id) {
        global.onlineUsers.delete(userId);
        console.log("Removed user:", userId);
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server and Socket.IO running on port ${port}`);
});