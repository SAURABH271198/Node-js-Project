const express=require('express');
const ej=require('ejs');
const path=require('path');
const multer=require('multer');
const app=express();

let port=process.env.PORT||3000;

//setting for multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/myupload')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })


  var upload = multer({ storage: storage }).single("profilepic");

//setup for ejs
app.set("view engine","ejs")

//setting middleware for static file
app.use(express.static("./public"))

app.get("/",(req,res)=>{
    res.render("index");
})

app.post("/upload",(req,res)=>{

    upload(req,res,(error)=>{
        if(error)
        {
            res.render("index",{messege:error})
        }
        else
        {
            res.render("index",{messege:"succesfully uploaded",
            
            filename:`myupload/${req.file.filename}`
            })
        }
    })
})

app.listen(port,()=>{

    console.log('the process is running at '+port);
})