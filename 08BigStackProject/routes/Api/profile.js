const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');

//load person model
const Person=require("../../models/Person");

//load profile model
const Profile=require("../../models/Profile");

// @type:get
// @route:/api/profile
// @desc: route for personal user profile
// @access:Private
router.get("/",
    passport.authenticate("jwt",{session:false}),
(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(!profile)
        {
           return res.status(404).json({profilenotfound:'No Profile Found',user:req.user.id})

        }
        res.json(profile)
        
    })
    .catch(err=>console.log(err))

})



// @type:POST
// @route:/api/profile
// @desc: route for updating/saving personal user profile
// @access:Private
router.post("/",passport.authenticate('jwt',{session:false}),
(req,res)=>{
    const profileValues={};
    profileValues.user=req.user.id;
    if(req.body.username)profileValues.username=req.body.username;
    if(req.body.website)profileValues.website=req.body.website;
    if(req.body.country)profileValues.country=req.body.country;
    if(req.body.portfolio)profileValues.portfolio=req.body.portfolio;
    if(typeof req.body.languages!= undefined)
    {
        profileValues.languages=req.body.languages.split(",");
    }
    if(req.body.youtube)profileValues.youtube=req.body.youtube;
    if(req.body.facebook)profileValues.facebook=req.body.facebook;
    if(req.body.instagram)profileValues.instagram=req.body.instagram;


    //do databse stuff here
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile)
        {
        Profile.findOneAndUpdate({user:req.user.id},
        {$set:profileValues},
        {new:true}
        )
        .then(profile=>{
            res.json(profile)
        })
        .catch(err=>console.log('Problem in Update'+err))
    }
    else
    {
        Profile.findOne({username:req.body.username})
        .then(profile=>{
            if(profile)
            {
                res.status(400).json({username:'username alreday exist'})
            }
            //  save user
            new Profile(profileValues).save()
            .then(profile=>res.json(profile))
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    }
        
    })
    .catch(err=>console.log("there is error in fetching profile "+ err))



}

)


//Unique Url Based Access

// @type:get
// @route:/api/profile
// @desc: route for url acccess
// @access:Public
router.get("/:username",(req,res)=>{

    Profile.findOne({username:req.params.username})
    .populate("user",['name','date'])
    .then(profile=>{
        if(!profile)

        {
            res.status(404).json({usernotfound:'User Not Found'})
        }
        res.json(profile);
    })
    .catch(err=>console.log(err))
})






// @type:delete
// @route:/api/profile/delete
// @desc: route for delete user based on id
// @access:Private

router.delete("/",passport.authenticate('jwt',{session:false}),(req,res)=>{


   Profile.findOne({user:req.user.id})
   Profile.findOneAndRemove({user:req.user.id})
   .then(()=>{

    Person.findOneAndRemove({_id:req.user.id})
    .then(()=>{
        res.json({success:'Delete is Successs'})
    })
    .catch(err=>console.log(err))

   })
   .catch(err=>console.log(err))
})



// @type:POST
// @route:/api/profile/mywork
// @desc: route for adding work profile of a person
// @access:Private

router.post("/workrole",passport.authenticate("jwt",{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        //assignment
        const newWork={

            role:req.body.role,
            company:req.body.company,
            country:req.body.country,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            details:req.body.details


        }
        profile.workrole.push(newWork);
        profile.save()
        .then(profile=>{
            res.json(profile)
        })
        .catch(err=>console.log(err))

    })
    .catch(err=>console.log(err))
})



// @type:POST
// @route:/api/profile/mywork/:w_id
// @desc: route for deletig specific workrole
// @access:Private

router.delete("/workrole/:w_id",passport.authenticate("jwt",{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
    //assignment to check if e get a profile
    const removethis=profile.workrole
    .map(item=>item.id)
    .indexOf(req.param.w_id)

    profile.workrole.splice(removethis,1);
    profile.save()
    .then(profile=>{
        res.json(profile)
    })
    .catch(err=>console.log(err));

})
.catch(err=>console.log(err))

})



module.exports=router;