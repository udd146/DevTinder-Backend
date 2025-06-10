const express = require('express')
const { userAuth } = require('../middleware/userAuth')
const bcrypt = require("bcrypt")

const profileRouter = express.Router()
const userDataToSend = ["firstName","lastName","age","gender"]

profileRouter.get('/getProfile', userAuth, (req, res) => {
    try {
      const data ={}
      for(key in req.user)
      {
        if(userDataToSend.includes(key))
        {
          data[key]= req.user[key]
        }
      }
      res.json({"message":"Profile get Successfully","data":data});
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  
  profileRouter.patch('/updateProfile', userAuth, async (req, res) => {
    try {
       //step-1 validate only that data that are allowed to update
       const allowedUpdateData = ["firstName","lastName","age","gender"]
       const isUpdateAllowed = Object.keys(req.body).every(e=>allowedUpdateData.includes(e))
       
       if(!isUpdateAllowed)
        throw new Error("Updation is not Possible for these fields")

     //step-2 update the data
     const loggedInUser= req.user
    //  console.log(users)
     Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key])

     await loggedInUser.save()
 
     res.json({"message":`${loggedInUser.firstName} profile is updated successfully`,
        "data":loggedInUser})
  
     
    // res.send("Update Profile")
    } catch (e) {
      res.status(500).send(e.message);
    }
  });


profileRouter.patch('/updatePassword',userAuth,async (req,res)=>{
    try{
     
       const {previousPassword, newPassword} = req.body

       const loggedInUser = req.user
       
       const isPreviousPasswordValid =  loggedInUser.validatePassword(previousPassword)

       if(!isPreviousPasswordValid)
          throw new Error("Wrong Password")
    //    console.log(isPreviousPasswordValid)

    loggedInUser.password = bcrypt.hashSync(newPassword,10);

    await loggedInUser.save()
       
    
    res.json({"message":"Passoword Updated Sucessfully!!!"})
    }
    catch(e)
    {
        res.status(500).send(e.message);
    }
})


module.exports = profileRouter