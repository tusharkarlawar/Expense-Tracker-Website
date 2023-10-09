const User = require("../models/user"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

require('dotenv').config();

exports.addUser = async(req,res,next)=>{
    try{
        const {name, email, password} = req.body;
       
        const saltrounds = 10
        bcrypt.hash(password, saltrounds, async(error, hash)=>{
            const data = await User.create({
                name:name,
                email:email,
                password:hash,
            })
            res.json({newUser: data, msg:"User created", success: true});
        });
    }
    catch (err) {
        res.status(403).json({
          error: err,
        });
      }
};
        
            
                    

function generateAccessToken(id, isPremium){
    return jwt.sign({userId: id, isPremium: isPremium}, process.env.SECRET_KEY) //generate token//stateless
}

exports.userLogin = async(req,res,next)=>{
    try{
        const { email, password} = req.body;
        const login = await User.find({email:email})
        console.log(login[0]);
        if(login.length>0){
            bcrypt.compare(password, login[0].password, async(err, result)=>{
                if(err){
                    return(res.json({msg:"dcrypting error",
                    success:false}))
                }
                if(result===true){
                    return(
                        res.json({msg:"Password is correct",
                    success:true, token: generateAccessToken(login[0].id, login[0].isPremium)}
                    ))
                }else{
                    return(res.json({msg:"Password is incorrect",
                    success:false}))
                }
            })
        }
        else{
                return(res.json("User doesnt exist"));
            }
            
    }
    catch(error){
        res.json({Error: error});
    }
}
