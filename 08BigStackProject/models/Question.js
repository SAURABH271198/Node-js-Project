const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const QusetionSchema=new Schema({

user:{
type:Schema.Types.ObjectId,
ref:"myPerson"

},

textone:{
    type:String,
    require:true
},
texttwo:{
    type:String,
    require:true
},

name:{

    type:String,
},

upvotes:[{

    user:{
    type:Schema.Types.ObjectId,
    ref:"myPerson"
    }



}],

answers:[{

    user:{
        type:Schema.Types.ObjectId,
        ref:"myPerson"
        },
    text:{

        type:String,
        require:true
    },
    name:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
    

}],

date:{

    type:Date,
    default:Date.now

}


})

module.exports=Question=mongoose.model("myquestion",QusetionSchema);