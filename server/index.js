console.log("Dream to Startup")
const express=require('express');
const app=express();
app.use(express.json());
require('dotenv').config();
const port=process.env.PORT;
const ConfigureDB=require('./config/db')
const ctrl=require('./app/controllers/Users-controller')

ConfigureDB()

app.post('/register',ctrl.register)
app.post('/login',ctrl.login);

app.listen(port,()=>{
    console.log('server running on the port',port)
})

