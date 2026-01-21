console.log("Dream to Startup")

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const cors = require("cors");
app.use(cors());

const ConfigureDB = require('./config/db')
ConfigureDB()
const port = process.env.PORT;

const socketHandler = require("./app/utils/Socket");
socketHandler(io);

const AuthenticateUser = require('./app/middlewares/AuthenticateUser')
const AuthorizeUser = require('./app/middlewares/Authorizeuser')
const { EntrepreneurUploads, InvestorUploads } = require("./app/middlewares/UploadConfig")
const upload = require('./app/middlewares/Multer')

const PitchCtrl = require("./app/controllers/Pitch-controller")
const MessageCtrl = require('./app/controllers/Message-controller');
const UserCtrl = require('./app/controllers/Users-controller')
const EntrepreneurCtrl = require("./app/controllers/Entrepreneur-Controller")
const InvestorCtrl = require('./app/controllers/Investor-controller')
const PaymentCtrl = require("./app/controllers/Payment-Controller");
const AiReviewCtrl = require('./app/controllers/AiReview-controller')
const NotificationCtrl = require('./app/controllers/Notification-controller')



app.post("/get-review", AiReviewCtrl.getResponse);
app.post("/payment/create-order", AuthenticateUser, PaymentCtrl.createOrder);
app.post("/payment/verify", AuthenticateUser, PaymentCtrl.verifyPayment);
app.get("/payment/history/:EntrepreneurId", AuthenticateUser, PaymentCtrl.getPaymentHistory);
app.get("/payment/:paymentId", AuthenticateUser, PaymentCtrl.getPayment);
app.put("/payment/:paymentId", AuthenticateUser, PaymentCtrl.updatePaymentStatus);
app.post('/api/register', UserCtrl.register)
app.post('/api/login', UserCtrl.login);
app.get('/api/account', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), UserCtrl.account)
app.put('/api/account', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), UserCtrl.updateAccount)
app.get('/api/users/all', AuthenticateUser, AuthorizeUser(["admin","investor","entrepreneur"]), UserCtrl.getAllUsers)
app.get('/api/admin/statistics', AuthenticateUser, AuthorizeUser(["admin","investor","entrepreneur"]), UserCtrl.getStatistics)

app.post('/api/Entrepreneur', AuthenticateUser, AuthorizeUser(["entrepreneur","investor"]), EntrepreneurUploads, EntrepreneurCtrl.create)
app.get('/api/Entrepreneurs', AuthenticateUser, AuthorizeUser(["admin", "entrepreneur", "investor"]), EntrepreneurCtrl.list)
app.get('/api/Entrepreneur/:id', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), EntrepreneurCtrl.show)
app.put('/api/Entrepreneur/:id', AuthenticateUser, AuthorizeUser(["admin", "entrepreneur"]), EntrepreneurUploads, EntrepreneurCtrl.update)
app.delete('/api/Entrepreneur/:id', AuthenticateUser, AuthorizeUser(["admin", "entrepreneur"]), EntrepreneurCtrl.delete)

app.post('/api/Investor', AuthenticateUser, AuthorizeUser(["investor", "user"]), InvestorUploads, InvestorCtrl.create)
app.get('/api/Investors', AuthenticateUser, AuthorizeUser(["admin", "investor", "entrepreneur"]), InvestorCtrl.list)
app.get('/api/Investor/:id', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), InvestorCtrl.show)
app.get('/api/admin/pending-verifications', AuthenticateUser, AuthorizeUser(["admin","investor","entrepreneur"]), InvestorCtrl.getPendingVerifications)
app.put('/api/Investor/:id', AuthenticateUser, AuthorizeUser(["investor", "admin"]), InvestorUploads, InvestorCtrl.update)
app.delete('/api/Investor/:id', AuthenticateUser, AuthorizeUser(["admin", "investor"]), InvestorCtrl.delete)

app.post('/api/Pitch', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), upload.single('Pitch'), PitchCtrl.create);
app.get('/api/Pitch', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), PitchCtrl.list);
app.get('/api/Pitchs/:id', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), PitchCtrl.listByUser);
app.put('/api/Pitch/:id', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin"]), upload.single('Pitch'), PitchCtrl.update);
app.delete('/api/Pitch/:id', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin"]), PitchCtrl.delete);

app.post("/api/messages/send", MessageCtrl.sent);
app.get("/api/messages/get/:userId/:otherUserId", MessageCtrl.getmessage);
app.get("/api/messages/conversations/:userId", MessageCtrl.getConversations);

app.post("/api/notifications", AuthenticateUser, NotificationCtrl.create);
app.get("/api/notifications/:receiver", AuthenticateUser, NotificationCtrl.getNotifications);
app.get("/api/notifications/unread/:receiver", AuthenticateUser, NotificationCtrl.getUnreadCount);
app.put("/api/notifications/:notificationId/status", AuthenticateUser, NotificationCtrl.updateStatus);
app.put("/api/notifications/:notificationId/confirm", AuthenticateUser, NotificationCtrl.confirmConnection);
app.put("/api/notifications/:notificationId/reject", AuthenticateUser, NotificationCtrl.rejectConnection);
app.put("/api/notifications/:notificationId/read", AuthenticateUser, NotificationCtrl.markAsRead);
app.delete("/api/notifications/:notificationId", AuthenticateUser, NotificationCtrl.delete);

app.get('/api/Aireview/:id', AuthenticateUser, AuthorizeUser(["entrepreneur", "admin", "investor"]), AiReviewCtrl.getResponse);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});