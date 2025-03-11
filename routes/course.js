
const express = require("express");

const courseRouter = express.Router(); 


    courseRouter.post("/purchase", function(req, res){
            res.json({
                message: "you are courses"
            })
    })
    courseRouter.get("/preview", function(req, res) {
        res.json({
            message: "you are courses"
        })
    })  
    




module.exports = {
    courseRouter: courseRouter
}


