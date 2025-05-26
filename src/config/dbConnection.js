
const mongoose= require('mongoose')

 

const dbConnection = async ()=>{

  try{
    await mongoose.connect("mongodb+srv://ukgupta146:cuVfLGgCrQR3RFVP@cluster0.esjmula.mongodb.net/devTinder")
    console.log("db connected")
  }
  catch(e)
  {
   console.log("some errors" , e.message)
  }

}


module.exports = dbConnection


