const express=require('express');
const app=express();

app.get("/",(req,res)=>{

    res.send("hello this is home page");
})

app.listen(8000,()=>{
    console.log("server is runnig at port:8000");
})

app.get("/about",(req,res)=>{
    res.status(200).json({name:'saurabh',age:24});
})

app.get("/user/:id/status/:status_id",(req,res)=>{
    res.send(req.params);
});

app.get("/flights/:from-:to",(req,res)=>{
    res.send(req.params);
});