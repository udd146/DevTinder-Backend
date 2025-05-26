const express = require("express")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")

const app = express()
const dbConnection = require('./config/dbConnection')
const UserModel = require('./Schema/UserSchema')
const {userAuth} = require('./middleware/userAuth')
const {validate} = require('./helper/validate')

app.use(express.json())
app.use(cookieParser())


app.post("/signUp",async (req,res)=>{
  try{

    const user = req.body
    const {password} = user
    console.log(user)

    const hash = bcrypt.hashSync(password,10);

    console.log(hash,"hashPassword")
    const doc = new UserModel({...user,"password":hash})
    await doc.save()
   res.send("User Created Sucessfully")
   }
  catch(e)
  {
   res.status(404).send("there is issue in creating user" + e.message)
  }
})

app.post("/login",userAuth, async (req, res) => {
  try {
    await validate(req);  
    res.cookie("token","123djedejdnejdb62135612")
    res.send("Login successful");
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.use('/',(req,res)=>{
    res.send("Hello")
})


const startServer = async ()=>{
  try{
    await dbConnection()
    app.listen(3001,()=>{
        console.log("Server started Successfull at ...3001")
    })
  }
  catch(e)
  {
     console.log("there is some problem in data connection", e.message)
  }
}
 

startServer()

