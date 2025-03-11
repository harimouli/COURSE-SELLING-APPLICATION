const express = require('express');
const {userModel} = require("../db.js");
const userRouter = express.Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: errorMap } = require('zod/locales/en.js');

const JWT_USER_PASSWORD = "jfdhgdhmgd"

//handlers 


userRouter.post("/signup",  async function(req, res) {

    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100)
    })
    const parsedDataWithSuccess = requireBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        console.log(parsedDataWithSuccess);
        res.json({
            message:parsedDataWithSuccess.error.issues[1].message
        })
        return;
    }
    const {email, password, firstName, lastName} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
    }catch(e){
        res.json({
            message: "Signup failed!"
        })
        return;
    }

    res.json({
        message: "Signup succeeded"
    })
    

})
    
    
 userRouter.post("/signin", async function(req, res) {
   const {email, password} = req.body;

   const user = await userModel.findOne({
    email
   });
   if(user){
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch){
            const token =  jwt.sign({
                id: user._id
            }, JWT_USER_PASSWORD)
            res.json({
                token: token
            })
        }
        else{
            res.json({
                message: "Incorrect Credentials!"
            })
        }
   }
   
   else{
        res.status(401).json({
            message: "You are not signed up"
        })
   }

})
    
userRouter.get("/purchases", function(req, res){
    res.json({
            message: ""
        })
})



module.exports= {
        userRouter: userRouter
}