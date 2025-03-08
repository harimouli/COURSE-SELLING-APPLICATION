
const express = require("express");

const app = express();

const port = 3000;



app.post("/user/signup", function(req, res) {
    res.json({
        message: "signup  endpoint"
    })
})


app.post("/user/signin", function(req, res) {
    res.json({
        message: "usignin  endpoint"
    })
})

app.get("/user/purchases", function(req, res){
    res.json({
        message: ""
    })
})

app.post("/course/purchase", function(req, res){

})
app.get("/courses", function(req, res) {

})


app.listen(port, ()=> {
    console.log(`server is running at ${port}`);
})