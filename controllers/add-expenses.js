//here we add, get and deleted the expense//
const mongoose = require("mongoose");
const Expense = require("../models/expense");
const User = require("../models/user"); 
//const sequelize = require("../util/database");
require('dotenv').config();

exports.addExpenses = async(req,res,next)=>{
    try{
        const {description,amount,category} = req.body
        //console.log(description, amount);
        //let totalExpense=0;
        //console.log(req.user)
        const data = await Expense.create({
            description,
            amount,
            category,
            userId: req.user._id,
        })
        totalexp = Number(req.user.totalExpense) + Number(amount);
       
        await req.user.updateOne({
            totalExpense: totalexp,
        });
        res.json({newexpense: data, success: true});
    }
    catch(err){
        console.log(err);
        res.json({
            Error: err
        });
    }
}

exports.getExpenses = async(req,res,next)=>{
    try{
        const data = await Expense.find( {userId : req.user._id} )
        console.log(data);
            return res.json({allExpense: data});
    }catch(err){
        console.log("Error in app.js get method");
        return res.json({Error: err});
    }
}

exports.deleteExpense = async(req,res,next)=>{
        try{
        
        const detailsId = req.params.id;
        
        const expenses = await Expense.findById( detailsId )  //array of object
        console.log(expenses);
        
        
        const totalexp = Number(req.user.totalExpense) - Number(expenses.amount);
        // console.log(totalexp);

        await req.user.updateOne({
            totalExpense: totalexp,
        });
       

        const destroy = await expenses.deleteOne();
        // console.log(destroy);
         if (destroy === 0) {
            return res
             .status(401)
             .json({ success: false, message: "Expense doesnt belong to User" });
        }
        res.json({msg:"Deleted", success:true});
    }
    catch(err){
        console.log("Error in delete Method", err);
        res.json({Error: 'Internal server error'});
    }
}

// pagination for the expenses//
// exports.showNumberExpense = async(req,res,next)=>{
//     try{
//         const{page,pagesize}=req.query;
//         const limits=+pagesize;
//         const data=  await Expense.find({ userId: req.user._id })
//             offset:(page-1)*pagesize, //skip the pages
//             limit:limits,

//         console.log(data)
//         res.json({Data:data})
//     }catch(e){
//         console.log("pagination error-->",e)
//         res.json({Error:e})
//     }
// }

exports.showNumberExpense = async (req, res, next) => {
    try {
        const { page, pagesize } = req.query;
        const limit =+pagesize;
        const skip = (page - 1) * limit;
        console.log(limit);
        console.log(skip);

        // if (isNaN(limit) || isNaN(skip)) {
        //     return res.status(400).json({ error: 'Invalid pagination parameters' });
        // }


        const data = await Expense.find({ userId: req.user._id })
            .skip(skip)
            .limit(limit);

        res.json({ Data: data });
    } catch (e) {
        console.error("Pagination error", e);
        res.status(500).json({ error: e });
    }
};

