require('dotenv').config()
console.log(process.env.MONGO_URL) 
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { userRouter} = require("./routes/user");
const { courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin");

const port = 3000;
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

 async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, ()=> {
        console.log(`server is running at ${port}`);
    })
}
main();