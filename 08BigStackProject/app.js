const express=require('express');
const app=express();
const mongoose=require('mongoose');
let port=process.env.PORT ||4000;
const bodyparser=require('body-parser');
const passport=require('passport')


//bring all routes
const auth=require("./routes/Api/auth");
const profile=require("./routes/Api/profile");
const question=require("./routes/Api/question");


//mongoDB configuration
const db=require('./setup/myurl').mongoURL;

//middleware for bodyparser
app.use(bodyparser.urlencoded({extended:false}));

//middleware for static file
app.use(express.static(__dirname+"/public"))

//because it will through json object
app.use(bodyparser.json());

//attempt to connect database
mongoose.connect(db)
.then(()=>{
    console.log('mongodb connected succesfully')
})
.catch(err=>console.log(err));




//passport middleware
app.use(passport.initialize());

//config jwt strategy
require("./Strategies/jsonwtsrategies")(passport);

// actual route and these are Rest Api
app.use("/api/auth",auth);

//route  for profile Rest Api
app.use("/api/profile",profile);

//route  for question Rest Api
app.use("/api/question",question);


app.listen(port,()=>{

    console.log("server is running at "+port);
});