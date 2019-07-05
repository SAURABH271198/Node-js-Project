const express=require('express');
const passport=require('passport');
const Strategy=require('passport-facebook').Strategy;

passport.use(new Strategy({

    clientID:'311768243083702',
    clientSecret:'313f65ba0a1ffa16eca9a70aa8d204e5',
    callbackURL:'http://localhost:3000/login/facebook/return'
},

function(accessToken,refreshToken,profile,cb){

    return cb(null,profile);
}
)
);


passport.serializeUser(function(user,cb){
    cb(null,user)
})



passport.deserializeUser(function(user,cb){
    cb(null,user)
})

//create express app
var app=express();

//set view
app.set("views",__dirname+"/views");

//set view engine
app.set("view engine","ejs");

//middleware 
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({extended:false}));
app.use(require('express-session')({secret:'lco app',resave:true,saveUninitialized:true}))

//@oute- GET /home
//@desc -a route for home page
//@access -PUBLIC

app.get("/",(req,res)=>{
    res.render("home",{user:req.user})
})

//@oute- GET /login
//@desc -a route for login page
//@access -PUBLIC

app.get("/login",(req,res)=>{
    res.render("login");
})

//@oute- GET /login/facebook
//@desc -a route for gacebook auth
//@access -PUBLIC

app.get('/login/facebook',(req,res)=>{
    passport.authenticate('facebook')
})

//for failure redirect

//@oute- GET /login/facebook/callback
//@desc -a route for facebook auth
//@access -PUBLIC

app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  })


//@oute- GET /profile
//@desc -a route for profile
//@access -PRIVATE

app.get("/profile",require('connect-ensure-login').ensureLoggedIn(),(req,res)=>{
    res.render("profile",{user:req,user})
})

var port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log('server is started at 3000')
});
