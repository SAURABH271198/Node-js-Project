const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');

//load person model
const Person=require("../../models/Person");

//load profile model
const Profile=require("../../models/Profile");

//load question model
const Question=require("../../models/Question");


//@type :GET
//@route:/api/question
//@desc:This is the route for Showing all Question
//@access :PUBLIC

router.get("/",(req,res)=>{

Question.find().sort('-date')
.then(questions=>{
    if(questions.length!=0)
    {
        res.json(questions)
    }
    else{
        res.json({noquestion:"No Question is there"})
    }
})
.catch(err=>connsole.log(err))


});


//@type :POST
//@route:/api/question
//@desc:This is the route for posting/Submitting question
//@access :PRIVATE

router.post("/",passport.authenticate("jwt",{session:false}),(req,res)=>{

    
    Profile.findOne({user:req.user.id})
    .then((profile)=>{

        const newQuestion=new Question({

            textone:req.body.textone,
            texttwo:req.body.texttwo,
            user:req.user.id,
            name:profile.username
        })

        newQuestion.save()
        .then(question=>{
            res.json(question)
        })
        .catch(err=>console.log(err))

    })
    .catch(err=>console.log(err))
})



//@type :POST
//@route:/api/answers/:id
//@desc:This is the route for submitting Answer to question
//@access :PRIVATE

router.post("/answer/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{

    Question.findById(req.params.id)
    .then(question=>{

        const newanswer={

            user:req.user.id,
            name:req.body.name,
            text:req.body.text
        }

        question.answers.push(newanswer)
        question.save()
        .then(question=>{
            res.json(question)
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))


})


//@type :POST
//@route:/api/upvote/:id
//@desc:This is the route for upvoating
//@access :PRIVATE

router.post("/upvote/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{

        Question.findById(req.params.id)
        .then(question=>{
            if(question.upvotes.filter(upvote=>upvote.user.toString()===req.user.id,toString()).length>0){

                return res.status(400).json({noupvote:'User Already Upvoted'})
            }
            question.upvotes.push({user:req.user.id})
            question.save()
            .then(question=>{
                res.json(question)
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))

    })
    .catch(err=>console.log(err))


})

// @type:get
//@route:api/question/
// @description:this route is for deleting all question
// @access:PUBLIC
router.delete("/",(req,res)=>{

    Question.deleteMany()
    .then(()=>{
        res.json({del:"All Question Deleted"})
    })
    .catch(err=>connsole.log(err))
})

//@type :GET
//@route:/api/question
//@desc:This is the route for Showing all Question
//@access :PUBLIC

router.get("/",(req,res)=>{

    Question.find().sort('-date')
    .then(questions=>{
        if(questions.length!=0)
        {
            res.json(questions)
        }
        else{
            res.json({noquestion:"No Question is there"})
        }
    })
    .catch(err=>connsole.log(err))
    
    
    });







module.exports=router;