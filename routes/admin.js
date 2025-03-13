const express = require("express");

const adminRouter = express.Router();

const {adminModel} = require("../db");

const {z} = require("zod");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt"); 

const {JWT_ADMIN_PASSWORD} = require("../config");


adminRouter.post("/signup", async function(req, res) {
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
        await adminModel.create({
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


adminRouter.post("/signin", function(req, res) {
    res.json({
        message: "signin  endpoint"
    })
})

adminRouter.post("/course", function(req, res) {
    res.json({
        message: "signin  endpoint"
    })
})

adminRouter.put("/course", function(req, res){
    res.json({
        message: "signin  endpoint"
    })
})


adminRouter.get("/course/bulk", function(req, res){
    res.json({
        message: "signin  endpoint"
    })
})


module.exports = {
    adminRouter: adminRouter
}