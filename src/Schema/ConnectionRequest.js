const { default: mongoose } = require("mongoose");


const ConnectionRequest = mongoose.Schema({

  fromUserId : {type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"User"
  },
  toUserId : {type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
status : {type:String,
    enum: ["Accepted", "Rejected", "Interested", "Ignore"]
}

})

 
const ConnectionRequestModel = new mongoose.model("ConnectionRequest",ConnectionRequest)


module.exports= ConnectionRequestModel

