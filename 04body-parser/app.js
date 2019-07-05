const express=require('express');
const bodyparser=require('body-parser');
let path=require('path');

let app=express();

//middleware for the bodyparser
app.use(bodyparser.urlencoded({extended:false}));

//middleware for the serving static files
app.use("/",express.static(__dirname+"/public"));

app.use(express.static(__dirname+"/"));

app.get("/login",(req,res)=>{
   res.sendFile(__dirname+"/login.html")
})

app.listen(3000,()=>{
    console.log("server is running at port 3000");
})