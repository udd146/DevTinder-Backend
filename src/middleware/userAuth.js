const validator = require('validator')

const userAuth =async (req,res,next)=>{
  // validate email id and password
  // use jwt token and assign it to the cookies with 7 days expiry  
  // 
  
  next()
}

module.exports ={
    userAuth
}