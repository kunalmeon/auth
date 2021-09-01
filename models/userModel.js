const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Tell Us Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Tell Us Your Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Provide Your Password"],
    minLength: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm Your Password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password Does Not Matched.",
    },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresAt: Date,
  // active:{
  //     type:Boolean,
  //     default:true,
  //     select:false
  // }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword=async function(password,databasePassword){
  
    let compare=await bcrypt.compare(password,databasePassword)
    console.log(`password compared result:${compare}`)
    return compare
}

module.exports = mongoose.model("userModel", userSchema);
