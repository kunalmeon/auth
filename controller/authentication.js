const userModel = require("../models/userModel");
const jsonWebToken = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const {promisify}=require('util')

function tokenMaker(userId) {
  return jsonWebToken.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
}

function createAndSendToken(user, statusCode, req, res) {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_AT * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" ||
      req.headers["x-forwarded-proto"] === "https",
  };
  const token = tokenMaker(user._id);
  user.password = undefined;
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.singUp = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create(req.body);

  createAndSendToken(newUser, 201, req, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Enter email and password", 400));
  }
  const loginUser = await userModel.findOne({ email }).select("+password");
  
  if (!loginUser||!(await loginUser.comparePassword(password, loginUser.password))) {
    return next(new appError("Invalid email or password", 403));
    
  }
  createAndSendToken(loginUser,200,req,res)
  
});

exports.logOut=(req,res)=>{
  res.cookie('jwt','dummy cookie for logging out',{
    expires:new Date(Date.now()+5*1000),
    httpOnly:true
  });
  res.status(200).json({
    status:"logged Out"
  })
}


exports.protect=catchAsync(async(req,res,next)=>{

  let token;
  if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1]
  }
  else if(req.cookie.jwt){
    token=req.cookie.jwt
    
  }
  
  if(!token) return next(new appError('Not logged in',401))
  
  let decoded=await promisify(jsonWebToken.verify)(token,process.env.SECRET_KEY)
  console.log(decoded)
 

  const loggedInUser=await userModel.findById({id:decoded.userId})
  
  
 
  next()
})
