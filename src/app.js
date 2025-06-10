const express = require("express")

const cookieParser = require("cookie-parser")
const authRouter = require("./router/authRouter")
const cors = require('cors')
const app = express()
const dbConnection = require('./config/dbConnection')
const userRouter = require("./router/profileRouter")
const connectionRequestRouter = require("./router/connectionRequestRouter")
const feedRouter = require("./router/feedRouter")
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  
};

// define all global middleware
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

 
// defining routes here
app.use("/",authRouter)
app.use("/",userRouter)
app.use("/",feedRouter)
app.use("/",connectionRequestRouter)

app.use("/",(req,res)=>{
  res.send("Hello")
})

app.use((err, req, res, next) => {
  res.status(401).json({ error: err.message || "Something went wrong" });
});

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

