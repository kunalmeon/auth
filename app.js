require("dotenv").config({ path: "./config.env" });
const express=require('express');
const cors = require("cors");
const app=express();
const appError=require('./utils/appError')
const globalErrorHandler=require('./controller/globalErrorHandler')
app.use(cors());
app.use(express.json())
//Routes

const userRouter= require('./route/userRoute')
app.use('/user',userRouter)


app.use('*',(req,res,next)=>{
  return  next(new appError(`no such ${req.originalUrl} in server`,400))
})
console.log(process.env.NODE_ENV)
//global error handler
app.use(globalErrorHandler)


module.exports = app;
