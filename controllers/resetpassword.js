const expense = require("../models/expense");
const User = require("../models/user"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const Forgotpassword = require("../models/forgotpassword");
const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");
// require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();
exports.forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        // console.log(email);
        const user = await User.findOne( {email: email});
        // console.log(User);
        if(user){
            const id = uuid.v4();
            // console.log(id);
            const result = await Forgotpassword.create({ userId: user._id, active: true });
            // console.log("result:",result); 

        const client=Sib.ApiClient.instance
            
        const apiKey=client.authentications['api-key']
        // apiKey.apiKey=process.env.SENDINBLUE_API_KEY
        apiKey.apiKey=process.env.SENDINBLUE_API_KEY;

       // console.log("apiKey.apiKey",process.env.SENDINBLUE_API_KEY); 
        
        
        const transEmailApi=new Sib.TransactionalEmailsApi();
        const sender={
            email:"tusharkarlawar95@gmail.com"
        }
    
        const receivers=[{ email:email}]
        
        //console.log("emailll",email); 
        const data= await transEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:`this is the test subject`,
            textcontent:`reset password`,
            htmlContent:`<a href="http://localhost:3000/resetpassword/${result._id}">Reset password</a>`
            
        })
        //console.log("dataa:",data);
        res.json({msg:"Mail sent successfully", success:true});
        }else{
            res.json({msg:"User doesnt exist", success:false});
        }
    }catch(error){
        console.log("errorr:",error);
    }
}

exports.resetpassword = async(req, res) => {
    try{
        const id =  req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findById(id)
    // console.log(forgotpasswordrequest);
        if(forgotpasswordrequest){
            await forgotpasswordrequest.updateOne({ active: false});
            res.send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            // console.log('called')
                                        }
                                    </script>
                                    <form action="/updatepassword/${forgotpasswordrequest._id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()


    }
    }catch(err){
        // console.log(err);
    }

}

exports.updatepassword = async(req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        
        const resetpasswordrequest = await Forgotpassword.findById( resetpasswordid )
        const user = await User.findById( resetpasswordrequest.userId );
                console.log('userDetails', user)
                if(user) {
                    //encrypt the password
                        bcrypt.hash(newpassword, 5, async(err, hash)=>{
                            // Store hash in your password DB.
                            if(err){
                                // console.log(err);
                                throw new Error(err);
                            }
                            await user.updateOne({ password: hash })
                                res.json({message: 'Successfuly update the new password', success: true});

                    });
            } else{
                return res.json({ error: 'No user Exists', success: false})
            }
    } catch(err){
        console.log(err)
        return res.status(403).json({ success: false } )
    }

}
