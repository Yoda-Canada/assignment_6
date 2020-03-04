/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: __Tengzhen Zhao____ Student ID: __051440139_____ Date: __Mar 6,2020______
*
* Online (Heroku) Link: ____________
*
********************************************************************************/ 
var express = require("express");
var multer=require("multer");
var bodyParser = require('body-parser')
var app=express();
var path=require("path");
var filesystem=require("fs");
var data=require("./data-service.js");
var exphbs=require("express-handlebars");
var HTTP_PORT=process.env.PORT||8080;

app.use(express.static('public'));


function onHttpStart(){
    console.log("Express http server listening on: "+HTTP_PORT);
}

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout:'main',
    helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
           },

           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }         
    }
}));

app.set('view engine', '.hbs');

//This will add the property "activeRoute" to "app.locals" whenever the route changes,
 //ie: if our route is "/employees/add", the app.locals.activeRoute value will be "/employees/add".
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });

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

        //res.json(img);--assignment 3
        res.render("images",img);
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
    //res.sendFile(path.join(__dirname, "/views/home.html"))
    res.render("home");
});

app.get("/about", function(req, res){
    //res.sendFile(path.join(__dirname, "/views/about.html"))
    res.render("about");
});

app.get("/employees/add", (req,res)=>{
    //res.sendFile(path.join(__dirname, "/views/addEmployee.html"))
    res.render("addEmployee");
});

app.get("/images/add", (req, res)=>{
    //res.sendFile(path.join(__dirname, "/views/addImage.html"))
    res.render("addImage");
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
        res.render("employees",{employees: data});
    }).catch((err)=>{
        console.log(err);
        res.render({message: "no results"});
    })
}else if(req.query.department){
    data.getEmployeesByDepartment(req.query.status).then((data)=>{
        res.render("employees",{employees: data});
    }).catch((err)=>{
        res.render({message: "no results"});
    })
}else if (req.query.isManager) {
    data.getEmployeesByManager(req.query.isManager).then((data) => {
      res.render("employees",{employees: data});
    }).catch((err) => {
      res.render({message: "no results"});
    })
} else {
    data.getAllEmployees().then((data) => {
        res.render("employees",{employees: data});
      }).catch((err) => {
        console.log(err);
        res.render({message: "no results"});
      })
  }

});

/*assignment 3
app.get("/employees/value", (req,res)=>{
    data.getEmployeeByNum(req.params.value).then((data) => {
      res.json(data);
    }).catch((err) => {
      console.log(err);
      res.json(err);
    })
  });       */

  /*
  app.get("/employee/employeeNum", (req,res)=>{
    data.getEmployeeByNum(req.params.employeeNum).then((data) => {
      res.render("employee", { employee: data });
    }).catch((err) => {
      console.log(err);
      res.render("employee",{message:"no results"});
    })
  });  

  app.post("/employee/update", (req, res) => {
    console.log(req.body);
    res.redirect("/employees");
   });
   */

/*app.get("/managers",(req,res)=>{
    data.getManagers().then((data)=>{
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.json(err);
    })
});*/

app.get("/departments",(req,res)=>{
    data.getDepartments().then((data)=>{
        res.render("departments", {departments: data});
    }).catch((err) => {
        console.log(err);
        res.render({message: "no results"});
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