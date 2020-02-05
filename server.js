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
var app=express();
var path=require("path");
var data=require("./data-service.js");
var HTTP_PORT=process.env.PORT||8080;

app.use(express.static('public'));

function onHttpStart(){
    console.log("Express http server listening on: "+HTTP_PORT);
}

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