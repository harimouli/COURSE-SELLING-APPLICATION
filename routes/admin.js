const express = require("express");

const adminRouter = express.Router();

const {adminModel, courseModel} = require("../db");

const {z} = require("zod");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt"); 

const {JWT_ADMIN_PASSWORD} = require("../config");
const {adminMiddleware} = require("../middlewares/admin");


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
    console.log(hashedPassword);
    
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


adminRouter.post("/signin", async function(req, res) {
    const {email, password} = req.body;

    const admin = await adminModel.findOne({
     email
    });
    if(admin){
         const passwordMatch = await bcrypt.compare(password, admin.password);
         if(passwordMatch){
             const token =  jwt.sign({
                 id: admin._id
             }, JWT_ADMIN_PASSWORD)
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

adminRouter.post("/course", adminMiddleware, async function(req, res) {
     const adminId = req.adminId;
     console.log(adminId)
     const {title , description, imageUrl, price} =   req.body;

     const course = await courseModel.create({
            title, 
            description,
            imageUrl, 
            price,
            creatorId: adminId
     });

     res.json({
        message: "Course, created",
        courseId : course._id
     })


})

adminRouter.put("/course", adminMiddleware, async  function(req, res){
     const adminId = req.id;
     const {title, description, imageUrl, price, courseId} =  req.body;

     const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
     }, {
        title, 
        description,
        imageUrl,
        price
     })
     res.json({
        message: 'Course updated',
        courseId: course._id
     })
})


adminRouter.get("/course/bulk", adminMiddleware ,async function(req, res){
   const adminId = req.id;

   const courses = await courseModel.find({
        creatorId: adminId
   })
   res.json({
        courses


   })
})


module.exports = {
    adminRouter: adminRouter
}