const jwt = require('jsonwebtoken'); 
const RazorPay = require('razorpay');
const Order = require("../models/orders");
const { route } = require("../routes/expenses");
require('dotenv').config();

exports.premiumMembership = async (req, res, next) => {
    try {
      var rzp = new RazorPay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
  
      const amount = 2500;
      rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
        if (err) {
          return err;
        }
        await Order.create({
          paymentid: "NULL",
          orderid: order.id,
          status: "PENDING",
          userId: req.user._id,
        });
        return res.status(201).json({ order, key_id: rzp.key_id });
      });
    } catch (err) {
      res.status(403).json({ message: "Something went wrong", error: err });
    }
  };

      
function generateAccessToken(id, isPremium){
    return jwt.sign({userId: id, isPremium}, 'secretKeyIsBiggerValue')
}


exports.updateStatus = async(req,res,next)=>{
    try{
        const {payment_id, order_id} = req.body;
        const orders = await Order.findOne({orderid: order_id});
        if(payment_id === null){
            res.json({success: false, msg:"Payment Failed"})
            return orders.updateOne({paymentid: payment_id, status:"FAILED"});
        }
        await orders.updateOne({paymentid: payment_id, status: "SUCCESSFUL"});
    
        await req.user.updateOne({isPremium: true});
        res.json({success: true, msg:"Transaction Sccessfull", token: generateAccessToken(req.user.id, true)});
    }catch(err){
        console.log(err);
        res.json({Err: err});
    }
}