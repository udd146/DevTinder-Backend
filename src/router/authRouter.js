const express = require('express')
const {validate} = require('../helper/validate')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const UserModel = require('../Schema/UserSchema')
const authRouter = express.Router()

const userDataToSend = ["firstName","lastName","age","gender"]

authRouter.post("/signUp",async (req,res)=>{
    try{
  
      const user = req.body
      const {password} = user
    //   console.log(user)

      const hash = bcrypt.hashSync(password,10);
     
      const doc = new UserModel({...user,"password":hash})
       
      await doc.save()
      const data= {}
      for(key in doc)
      {
        if(userDataToSend.includes(key))
        {
           data[key] = doc[key]
        }
      }
     res.status(200).json({"message":"User Successfully Signed up","data":data})
     }
    catch(e) 
    {
     res.status(404).send("there is issue in creating user" + e.message)
    }
  })


  
  authRouter.post("/login", async (req, res) => {
    try {
    //   await validate(req);  
    const { email, password } = req.body;
  
    const user = await UserModel.findOne({ email });
     
    if (!user) throw new Error("Invalid Credential");
  
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid Credential");
     
    const token = jwt.sign({_id:user._id},"DevTinder@5678",{
        expiresIn:"7d"
      })
   
    // only sending data which is required and not sending credentials of a user  
    const data={}
     for(let key in user)
     {
      if(userDataToSend.includes(key))
      {
        data[key] = user[key]
      }
     }
     
    res.cookie("token",token,{expires: new Date(Date.now() + 24*7*3600000)}) //cookie expired in 7 days
     
    res.status(200).json({message:"Login Successful",data:data})
    
  } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });


  authRouter.post("/logout",(req,res)=>{
    try{
      res.cookie("token",null)   
      res.json({"message":"User Logout Successfully"})
    }
    catch(e)
    {
      res.status.json({"message":`Some Issue Occured while Logout ${e.message}`})
    }
  })


  module.exports = authRouter