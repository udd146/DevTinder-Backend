const express = require("express")

const app = express()


app.get('/home',(req,res)=>{
    res.send("I am at my home buddy")
})

app.get('/test',(req,res)=>{
    res.send("I am doing testing buddy")
})

app.use((req,res)=>{
    res.send("Hello World")
})

app.listen(3001,()=>{
    console.log("Server started Successfull at ...3001")
})