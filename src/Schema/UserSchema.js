const { request } = require("express");
const { default: mongoose } = require("mongoose");
const validator = require("validator")



const userSchema = mongoose.Schema({
    firstName : {type:String,required:true},
    
    lastName:{type:String},
    
    age:{type:Number,min:18,max:60},
    
    gender:{type:String,validate:(value)=>{
        console.log(value,"gender value")
      if(value !== 'male' && value !== 'female' && value !== 'other')
        throw new Error("gender is not valid, it should be either male, female or other")
    },required:true},

    email:{type:String,unique:true,required:true,
        validate:(value)=>{
          if(!validator.isEmail(value)){
            throw new Error("email Id is not valid")
          }
        }
    },
    
    password:{type:String,required:true,
        validate: (value)=>{
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong, it should have  minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1")
            }
        }
    }
})


const UserModel = mongoose.model("User",userSchema)



module.exports = UserModel

