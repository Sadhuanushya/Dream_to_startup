
const Subscription=require("../models/payment-model");
const instance= require("../utils/Instance");
const PaymentCtrl={};
PaymentCtrl.pay=(async(req,res)=>{
    const options={
        amount:Number(req.body.amount),
        currency:"INR"
    }
    const order=await instance.orders.create(options)
    if(order){
        const payment=new Subscription(req.body);
        await payment.save();
        res.status(201).json(payment)   
    }
})
module.exports=PaymentCtrl;