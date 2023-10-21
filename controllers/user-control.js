const User = require("../models/user"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

require('dotenv').config();

exports.addUser = async(req,res,next)=>{
    try{
        const {name, email, password} = req.body;
        const user = await User.findOne({email:email});
        if(user){
            return res.status(409).json({messege:'User already exist'})
        }
        const saltrounds = 10
        const hash = await bcrypt.hash(password, saltrounds);
        const data = await User.create({
            name:name,
            email:email,
            password:hash,
        })
        res.json({newUser: data, msg:"User created", success: true});
    }
    catch (err) {
        console.log('user while signup',err);
        res.status(500).json({ meseege: 'Internal server error'});
    }
};
        
            
                    

function generateAccessToken(user){
    return jwt.sign({userId: user.id, name: user.name, isPremium: user.isPremium}, process.env.SECRET_KEY) //generate token//stateless
}

exports.userLogin = async(req,res,next)=>{
    try{
        const { email, password} = req.body;
        const user = await User.findOne({email:email})
        //console.log(login[0]);
        if(!user){
            return res.status(404).json("User doesnt exist");
        }

        const result = await bcrypt.compare(password, user.password);

        if(result){
            return(
                res.json({msg:"Password is correct",
            success:true, token: generateAccessToken(user)}
            ))
        }
        res.status(401).json({msg:"Password is incorrect",success:false})
                
    }catch(error){
        console.log("error while userLogin",error);
        res.status(500).json({messege: "Internal server error"});
    }
}
