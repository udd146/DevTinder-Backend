const express = require('express')
const { userAuth } = require('../middleware/userAuth')
const { mongoose } = require("mongoose");
const UserModel = require('../Schema/UserSchema')
const ConnectionRequestModel = require("../Schema/ConnectionRequest")

const connectionRequestRouter = express.Router()


connectionRequestRouter.post("/request/send/:status/:userId",userAuth,async (req,res)=>{
    try{
     // need to validate status - should be Intrested or Ignore
     const {status,userId} = req.params
     const AllowedStatus = ["Interested","Ignore"]
     
     const isAllowedStatus = AllowedStatus.includes(status)
     if(!isAllowedStatus)
        throw new Error("Status is Invalid")

     //checking valid object_id
     if (!mongoose.Types.ObjectId.isValid(userId)) { 
         throw new Error("Invalid Id Format")
      }
     
     // need to toUserId is not equal to from userId
     const loggedInUser = req.user
     if(loggedInUser._id.toString() == userId.toString())
        throw new Error("Cannot send Connection request to himself")
     
     //toUserId should exist in the system
     const isToUserExist = await UserModel.findById(userId);
     if(!isToUserExist)
        throw new Error("User not found")

     //now I need to check the same connection exist or not
     const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or : [{
            fromUserId:loggedInUser,
            toUserId:userId,
        },
        {
        fromUserId:userId,
        toUserId:loggedInUser
        }]
     })
    if(existingConnectionRequest)
        throw new Error("Connection Request Already Exist")
    
    //if everything is valid , then save connection request
    const connectionDoc = new ConnectionRequestModel({
        fromUserId:loggedInUser,
        toUserId:userId,
        status:status
     })

     await connectionDoc.save()
     
    
     status == "Interested" ? res.json({message:`${loggedInUser.firstName} is interested in ${isToUserExist.firstName}`}) : res.json({message:`${loggedInUser.firstName} has ignored ${isToUserExist.firstName}`})
     
    }
    catch(e){
      res.json({message:e.message})
    }
})

connectionRequestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try{
       //here requestId is a fromUserId and logggedIn id is a toUserId 
       const {status,requestId} = req.params
       const loggedInUser = req.user
        //validate the status
        const allowedStatus = ["Accepted","Rejected"]
        const isAllowedStatus = allowedStatus.includes(status)

        if(!isAllowedStatus)
            throw new Error("Status is Invalid")
       //validate the objectId
       if(!mongoose.Types.ObjectId.isValid(requestId))
           throw new Error("User Id is not Valid")
       //validate that it should accept or reject profile which are interested status

       if(requestId.toString() == loggedInUser._id)
          throw new Error("User cannot review , it's own Profile")
       
       const connectionRequest = await ConnectionRequestModel.findOne({
          fromUserId : requestId,
          toUserId : loggedInUser._id,
          status:"Interested"
       })
      
       connectionRequest.status = status
      

      await connectionRequest.save()
       
      res.status(200).json("Reviewed Connection Request")
    }
    catch (e) {
       res.status(400).json({message:e.message})
    }
})


//API to get the data of the user who are intrested in make connection
connectionRequestRouter.get("/getConnectionRequest",userAuth,async (req,res)=>{

    try{
         
        const loggedInUser = req.user
        // console.log(requestID)
        
        
       const getConnectionRequest = await ConnectionRequestModel.find({
          toUserId:loggedInUser._id,
          status :"Interested"
        }).populate("fromUserId","firstName lastName age gender")

        // console.log(getConnectionRequest)

        res.json({message:"Successfully Fetched Connection Request",data:getConnectionRequest})


    }
    catch(e)
    {

        res.json({message:e.message})
    } 
    

})

// Api to get the data of the user who are already friend
connectionRequestRouter.get("/getConnections",userAuth,async (req,res)=>{

    try{
         
        const loggedInUser = req.user
        // console.log(requestID)
        
        const getConnectionRequest = await ConnectionRequestModel.find({
         $or:[{toUserId:loggedInUser._id},
              {fromUserId:loggedInUser._id}] ,
            status:"Accepted"
        }).populate("fromUserId","firstName lastName age gender")

        // console.log(getConnectionRequest)

        res.json({message:"Successfully Fetched Connection Request",data:getConnectionRequest})
}
    catch(e)
    {
     res.json({message:e.message})
    } 
    

})

module.exports = connectionRequestRouter