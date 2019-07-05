// use to http
const http=require('http');
const url=require('url');
const fs=require("fs");
const path=require('path')
const host="127.0.0.1";
const port=5000;

//which type file support in our server

const mimeTypes={
    'html':'text/html',
    'css':'text/css',
    'js':'text/js',
    'png':'images/png',
    'jpeg':'image/jpeg'
}

//parse convert to string
//path name gives ex http://learncodeonline.in/aboutus

// path name gives about us

http.createServer((req,res)=>{

    var myuri=url.parse(req.url);

    var fileName=path.join(process.cwd(),myuri.pathname);

    console.log('file you are looking for '+fileName);
    var loadFile;

    try{
    loadFile=fs.lstatSync(fileNme);//load File
    }
    catch(error)
    {
        res.writeHead(404,{'content-type':'text/plain'})
        res.write('404 page not found');
        res.end();
        return;
    }
    if(loadFile.isFile())
    {
        var mimeType=mimeTypes[path.extname(fileNme).split(".").reverse()[0]];
        res.writeHead(200,{'content-type':mimeType})
        var fileStream=fs.createReadStream(fileName)
        fileStream.pipe(res)
    }
    else if(loadFile.isDirectory())
    {
        res.writeHead(302,{Location:'index.html'})
        res.end();
    }
    else{
        res.writeHead(500,{'content-type':'text/plain'})
        res.write('500 internal server Error')
        res.end();
    }
    
 

}).listen(port,()=>
{
    console.log(`Server is Running at ${host}:${port}`);
})


// 500-internal Error
//404 page not found
//200 page found