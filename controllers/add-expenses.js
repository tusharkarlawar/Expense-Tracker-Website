//here we add, get and deleted the expense//
const { default: mongoose } = require("mongoose");
const Expense = require("../models/expense");
const User = require("../models/user"); 
//const sequelize = require("../util/database");
require('dotenv').config();

exports.addExpenses = async(req,res,next)=>{
    try{
        const {description,amount,category} = req.body
        
        const data = await Expense.create({
            description,
            amount,
            category,
            userId: req.user._id,                 //associated with the currently authenticated user
        })
        totalexp = Number(req.user.totalExpense) + Number(amount);
       
        await req.user.updateOne({
            totalExpense: totalexp,
        });
        res.json({newexpense: data, success: true});
    }
    catch(err){
        console.log("Error in addExp Method", err);
        res.status(500).json({ meseege: 'Internal server error'});
    }
}

exports.getExpenses = async(req,res,next)=>{
    try{
        const data = await Expense.find( {userId : req.user._id} ) 
            return res.json({allExpense: data});
    }catch(err){
        console.log("Error in getexp Method", err);
        res.status(500).json({ meseege: 'Internal server error'});
    }
}

exports.deleteExpense = async(req,res,next)=>{
        try{
        const detailsId = req.params.id;
        const expenses = await Expense.findByIdAndDelete( detailsId )  //array of object
        const totalexp = Number(req.user.totalExpense) - Number(expenses.amount);
        await req.user.updateOne({
            totalExpense: totalexp,
        })
        res.json({msg:"Deleted", success:true});
    }
    catch(err){
        console.log("Error in delete Method", err);
        res.status(500).json({ meseege: 'Internal server error'});
    }
}


exports.showNumberExpense = async (req, res, next) => {
    try {
        const { page, pagesize } = req.query;
        const limit =+pagesize;
        const skip = (page - 1) * limit;
      
        const data = await Expense.find({ userId: req.user._id })
            .skip(skip)
            .limit(limit);

        res.json({ Data: data });
    } catch (err) {
        console.error("Pagination error", err);
        res.status(500).json({ meseege: 'Internal server error'});
    }
};

