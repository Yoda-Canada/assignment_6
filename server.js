var express = require("express");
var app=express();
var path=require("path");
var date=require("./data-service.js");
var HTTP_PORT=process.env.PORT||8080;

app.use(express.static('public/css'));
app.use(express.static('img')); 

function onHttpStart(){
    console.log("Express http server listening on: "+HTTP_PORT);
}

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get("/employees",(req,res)=>{
    data.getAllEmployees().then((data)=>{
        res.json(data);
    });
});


app.get("/managers",(req,res)=>{
    data.getManagers().then((data)=>{
        res.json(data);
    });
});

app.get("/departments",(req,res)=>{
    data.getDepartments().then((data)=>{
        res.json(data);
    });
});

app.use((req, res)=>{
    res.status(404).send("Page Not Found");
});



data.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch(err=>{
    console.log(err);
})