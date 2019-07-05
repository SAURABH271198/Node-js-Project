const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jsonwt=require('jsonwebtoken');
const passport=require('passport');
const mykey=require('../../setup/myurl');

// @type:GET
// @route:/api/auth
// @desc: jus for testing
// @access:PUBLIC
router.get("/",(req,res)=>res.json({test:'auth is being tested'}));

//import schema for person to register
const Person=require("../../models/Person");

// @type:POST
// @route:/api/auth/register
// @desc: route for registration of user
// @access:PUBLIC
router.post("/register",(req,res)=>{

    //find one based on the query
    Person.findOne({email:req.body.email})
    .then(person =>{

        if(person)
        {
            return res.status(400).json({emailerror:'Email is Already Registerd in our System'})
        }
        else
        {
            const newPerson=new Person({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            });

            //encrypt the password by bcryptjs
             bcrypt.genSalt(10, (err, salt)=> {
             bcrypt.hash(newPerson.password, salt, (err, hash)=> {
       
                if(err)throw err;
                newPerson.password=hash;//hash code saved at password
                newPerson.save()//save at mongodb
                .then(person=>res.json(person))
                .catch(err=>console.log(err))
    });
});
            
        }
    })
    .catch(err=>console.log(err));

})


// @type:POST
// @route:/api/auth/login
// @desc: route for login of user
// @access:PUBLIC
router.post("/login",(req,res)=>{

    let email=req.body.email;
    let password=req.body.password;

if(email=="admin123@gmail.com"&&password=="admin123")
{
    res.json({success:"Admin logged in"})
}
// if close
    else
    {
    Person.findOne({email:email})
    .then(person=>{
        if(!person)
        {
            return res.status(404).json({emailerror:'No User Found by this email'})
        }
        //if user is found
        bcrypt.compare(password,person.password)
        .then(isCorrect=>{
            if(!isCorrect)
            {
                res.json({password_err:'Password is Not Matched'})
            }
            else{
                
                //use payload and create tokenn for the user
                
                const payload={
                    id:person.id,
                    name:person.name,
                    email:person.email
                    
                }
                // payload close
                jsonwt.sign(payload,
                mykey.secret,
                {expiresIn:3600},
                (err,token)=>{
                    res.json({success:true,
                        token:"bearer "+token
                    })
                }
                    
                )
                
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err));
}

})




// @type:get
// @route:/api/auth/profile
// @desc: route for user profile
// @access:Private
router.get("/profile",passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({

        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        profilepic:req.user.profilepic
    })
})


module.exports=router;