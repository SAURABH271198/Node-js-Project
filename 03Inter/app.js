const express=require('express');
const app=express();


var myconsole=function(req,res,next)
{
    console.log("this is middleware");
    next();
}

app.use(myconsole);

app.get("/",(req,res)=>{

    res.send('hello world')
})

app.listen(8000,()=>{
    console.log("server is running at 8000");
});