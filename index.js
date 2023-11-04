const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get("/",async(req,res)=>{
    res.send("Eat Link server in running")
})

app.listen(port,()=>{
    console.log(`eat link is running on ${port}`)
})