/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: __Tengzhen Zhao____ Student ID: __051440139_____ Date: __Feb 18,2020______
*
* Online (Heroku) Link: __https://protected-ridge-32775.herokuapp.com/employees/add__________
*
********************************************************************************/ 
var express = require("express");
var multer=require("multer");
var bodyParser = require('body-parser')
var app=express();
var path=require("path");
var filesystem=require("fs");
var data=require("./data-service.js");
var HTTP_PORT=process.env.PORT||8080;

app.use(express.static('public'));

function onHttpStart(){
    console.log("Express http server listening on: "+HTTP_PORT);
}

var imagePath="./public/images/uploaded"
const storage=multer.diskStorage({

    destination:  "./public/images/uploaded",
               
    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }
});

const upload = multer({ storage: storage });

app.get("/images", function(req, res){

    filesystem.readdir(path.join(__dirname, imagePath), (err, items)=>{
        var img={images:[]};
        for(var i=0; i<items.length; i++)
            img.images.push(items[i]);

        res.json(img);
    });
});


app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });


app.use(bodyParser.urlencoded({ extended: true }));

app.post("/employees/add", function(req, res){
    data.addEmployee(req.body)
    .then(()=> {
      res.redirect("/employees");
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

/*assignment 2
app.get("/employees",(req,res)=>{
    data.getAllEmployees().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        res.json(err);
    })
});*/

app.get("/employees",(req,res)=>{
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        res.json(err);
    })
}else if(req.query.department){
    data.getEmployeesByDepartment(req.query.status).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    })
}else if (req.query.isManager) {
    data.getEmployeesByManager(req.query.isManager).then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    })
} else {
    data.getAllEmployees().then((data) => {
        res.json(data);
      }).catch((err) => {
        console.log(err);
        res.json(err);
      })
  }

});


app.get("/employees/value", (req,res)=>{
    data.getEmployeeByNum(req.params.num).then((data) => {
      res.json(data);
    }).catch((err) => {
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