const express= require('express')
const { userAuth } = require('../middleware/userAuth')
const UserModel = require('../Schema/UserSchema')
const ConnectionRequestModel = require('../Schema/ConnectionRequest')
const userDataToSend = ["firstName","lastName","age","gender"]
const feedRouter = express.Router()



feedRouter.get("/feed",userAuth,async (req,res)=>{
try
 {
    const loggedInUser = req.user
    // console.log(loggedInUser)

    const ConnectionData = await ConnectionRequestModel.find({
        $or:[{toUserId:loggedInUser._id},
            {fromUserId:loggedInUser._id}] 
        // $or:[{fromUserId:loggerIn_user._id},{toUserId:loggerIn_user._id}]
    })
    // console.log(ConnectionData)
    // getting the Ids that are already have a connection request with the logged_in User 
    const uniqueIdSet = new Set()
     for(index in ConnectionData)
      {
        uniqueIdSet.add(ConnectionData[index].fromUserId.toString())
        uniqueIdSet.add(ConnectionData[index].toUserId.toString())
      }
    const uniqeIds = [...uniqueIdSet]
    
    const feedData = await UserModel.find({
        _id: { $nin: uniqeIds }
      }).select(userDataToSend);
    // console.log(feedData)

    res.status(200).json({"message":"Fetched Feed Data","data":feedData})
 }
 catch(e)
 {
    res.status(400).json({"message":"Feed data is not fetched","error":e.message})

 }


})


module.exports = feedRouter