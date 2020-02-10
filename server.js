/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: __Tengzhen Zhao____ Student ID: __051440139_____ Date: __Jan 31,2020______
*
* Online (Heroku) Link: __https://protected-ridge-32775.herokuapp.com/___________
*
********************************************************************************/ 
var express = require("express");
var multer=require("multer");
var app=express();
var path=require("path");
var filesystem=require("fs");
var data=require("./data-service.js");
var HTTP_PORT=process.env.PORT||8080;

app.use(express.static('public'));

function onHttpStart(){
    console.log("Express http server listening on: "+HTTP_PORT);
}

const storage=multer.diskStorage({

    destination:"./public/images/uploaded",

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }
})

const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });

app.get("/images", function(req, res){
    
    filesystem.readdir(path.join(__dirname, imgPath), function(err, items){
        var img={images:[]};
        for(var i=0; i<items.length; i++)
            img.images.push(items[i]);

        res.json(img);
    });
});
  

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get("/employees/add", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"))
});

app.get("/images/add", (req, res)=>{
    res.sendFile(path.join(__dirname, "/views/addImage.html"))
});

app.get("/employees",(req,res)=>{
    data.getAllEmployees().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        res.json(err);
    })
});


app.get("/managers",(req,res)=>{
    data.getManagers().then((data)=>{
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.json(err);
    })
});

app.get("/departments",(req,res)=>{
    data.getDepartments().then((data)=>{
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.json(err);
    })
});

app.use((req, res)=>{
    res.status(404).send("404 Page");
});



data.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch(err=>{
    console.log(err);
})