const userModel=require('../models/userModel')
const authcontroller=require('./authentication')
const appError=require('../utils/appError')
const catchAsync=require('../utils/catchAsync')


exports.getUsers=async(req,res,next)=>{
const allUsers=await userModel.find();
res.status(200).json({
  data:allUsers
})
}

exports.getSingleUser=catchAsync(async(req,res,next)=>{
  
  const user=await userModel.findById(req.params.id);
  console.log(req.params.id)
  if(!user){
    return next(new appError('No user With such id',400))
  }
  res.status(200).json({data:user})
})


