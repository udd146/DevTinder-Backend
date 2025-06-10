const validator = require('validator')
const jwt = require('jsonwebtoken')
const UserModel = require('../Schema/UserSchema')

const userAuth =async (req,res,next)=>{
  // validate email id and password
  // use jwt token and assign it to the cookies with 7 days expiry  
  // 
   try{
    // console.log(req.cookies,"Cookie")
    const {token} = req.cookies
    // console.log(token,"token") 
    var decoded = jwt.verify(token, 'DevTinder@5678');
    
    const id = decoded._id
    const user = await UserModel.findOne({_id:id})
     
    req.user = user
    next() 
    
   }
   catch(e)
   {
    return next(new Error("User is not Logged In"))
   }
  
}

module.exports ={
    userAuth
}