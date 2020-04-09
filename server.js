/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: __Tengzhen Zhao____ Student ID: __051440139_____ Date: __Mar 24,2020______
*
* Online (Heroku) Link: __https://arcane-journey-98407.herokuapp.com/_
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
var dataServiceAuth = require("./data-service-auth.js");
const clientSessions = require("client-sessions");
var HTTP_PORT=process.env.PORT||8080;

app.use(express.static('public'));


function onHttpStart(){
    console.log("Express http server listening on: "+ HTTP_PORT);
}

app.use(clientSessions({
    cookieName: "session",
    secret:"web322_a6",
    duration: 2*60*1000,
    activeDuration: 60*1000
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

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

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });

    function ensureLogin (req, res, next){
        if (!(req.session.user)){
            res.redirect("/login");
        }
        else{
            next();
        }
    }

var imagePath="./public/images/uploaded"
const storage=multer.diskStorage({

    destination:  "./public/images/uploaded",
               
    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }
});

const upload = multer({ storage: storage });

app.get("/images", ensureLogin, function(req, res){

    filesystem.readdir(path.join(__dirname, imagePath), (err, items)=>{
        var img={images:[]};
        for(var i=0; i<items.length; i++)
            img.images.push(items[i]);

        //res.json(img);--assignment 3
        res.render("images",img);
    });
});


app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });


app.use(bodyParser.urlencoded({ extended: true }));

app.post("/employees/add", ensureLogin, function(req, res){
    data.addEmployee(req.body)
    .then(()=> {
      res.redirect("/employees");
    });
});

app.get("/home",(req,res)=>{
    res.render('home');
});
  

app.get("/", function(req, res){
    //res.sendFile(path.join(__dirname, "/views/home.html"))
    res.render("home");
});

app.get("/about", function(req, res){
    //res.sendFile(path.join(__dirname, "/views/about.html"))
    res.render("about");
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.post("/login", (req, res)=>{
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body)
    .then((user)=>{
        req.session.user = {
            userName: get_user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        };
        res.redirect('/employees');       
    })
    .catch((err)=>{
        res.render("login",{errorMessage: err, userName: req.body.userName} );
    });
});

app.post("/register", (req,res)=>{
    dataServiceAuth.registerUser(req.body)
    .then(()=>{
        res.render("register", {successMessage: "User created"});
    })
    .catch((err)=>{
        res.render("register",{errorMessage: err, userName: JSON.stringify(req.body.userName)});
    })
});

app.get("/logout", (req, res)=>{
    req.session.reset();
    res.redirect("/");
})

app.get("/userHistory", ensureLogin, (req, res)=>{
    res.render("userHistory",{user: req.session.user});
});

app.get("/employees/add", ensureLogin, (req,res)=>{
    data.getDepartments()
    .then((data)=>{
        res.render("addEmployee", {department: data});
    })
    .catch(()=>{
        res.render("addEmployee", {department: []}) 
    });
});

app.get("/images/add", ensureLogin, (req, res)=>{
    //res.sendFile(path.join(__dirname, "/views/addImage.html"))
    res.render("addImage");
});

// setup a get 'route' to display add department web site
app.get("/departments/add", ensureLogin, (req,res)=>{
    res.render('addDepartment');
});

// setup a post 'route' to add department
app.post("/departments/add", ensureLogin, function(req, res) {
    data.addDepartment(req.body) 
    .then(()=>{
        res.redirect("/departments");
    })
    .catch(()=>{
        console.log("unable to add department");
    });
});

// setup a post 'route' to update department
app.post("/department/update", ensureLogin, (req, res) => {
    data.updateDepartment(req.body)
    .then(()=>{res.redirect("/departments");})
    .catch( ()=>{
        res.status(500).send("Unnable to update department");
    })
});

app.get("/employees", ensureLogin, (req,res, Employees)=>{
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then((data)=>{
        if(data.length>0)
            res.render("employees",{employee: data.map(value=>value.dataValues)});
        else
            res.render("employees",{ message: "no results" });
    }).catch((err)=>{
        console.log(err);
        res.render({message: "no results"});
    })
}else if(req.query.department){
    data.getEmployeesByDepartment(req.query.department).then((data)=>{
        if(data.length>0) 
            res.render("employees",{employee: data.map(value=>value.dataValues)});
        else
            res.render("employees",{ message: "no results" });
    }).catch((err)=>{
        res.render({message: "no results"});
    })
}else if (req.query.manager) {
    data.getEmployeesByManager(req.query.manager).then((data) => {
        if(data.length>0) 
            res.render("employees",{employee: data.map(value=>value.dataValues)});
        else
            res.render("employees",{ message: "no results" });   
    }).catch((err) => {
      res.render({message: "no results"});
    })
} else {
    data.getAllEmployees().then((data) => {
        res.render("employees",{employee: data.map(value=>value.dataValues)});
      }).catch((err) => {
        console.log(err);
        res.render({message: "no results"});
      })
  }

});


   app.get("/employee/:num", ensureLogin, (req, res, data) => {

    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeeByNum(req.params.num).then((data) => {

    if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
        viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
    for (let i = 0; i < viewData.department.length; i++) {
    if (viewData.department[i].departmentId == viewData.employee.department) {
        viewData.department[i].selected = true;
    }
    }
    }).catch(() => {
        viewData.department = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
    } else {
    res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    }).catch(()=>{
        res.status(500).send("Unable to get Employee");
    })
   });

  app.get("/department/:num", ensureLogin, (req,res)=>{
    var num = req.params.num;
    data.getDepartmentById(num)
    .then((data)=>{
        if(data==null)
            res.status(404).send("Department not found");
        else{res.render("department",{department:data}); }
    })
    .catch(()=>{
        res.status(404).send("Department Not Found"); 
    });
})

  

  app.post("/employee/update", ensureLogin, (req, res) => {
    
    data.updateEmployee(req.body)
        .then(() => {
             res.redirect("/employees");
        })
        .catch(()=>{
            res.status(500).send("Unable to Update Employee");
        })
  });

  app.get("/employees/delete/:num",ensureLogin, (req,res)=>{
    var num = req.params.num;
    data.deleteEmployeeByNum(num)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove Employee / Employee not found)");
    })
});
  
   

app.get("/departments", ensureLogin, (req,res, Departments)=>{
    data.getDepartments().then((data)=>{
        if (data.length > 0)
            res.render("departments", {department: data.map(value=>value.dataValues)});
        else 
            res.render("departments",{message: "no results"});   
    }).catch((err) => {
        console.log(err);
        res.render({message: "no results"});
    })
});

app.use((req, res)=>{
    res.status(404).send("404 Page");
});


/*
data.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch(err=>{
    console.log(err);
})
*/

data.initialize()
.then(dataServiceAuth.initialize)
.then(function(){
 app.listen(HTTP_PORT, function(){
 console.log("app listening on: " + HTTP_PORT)
 });
}).catch(function(err){
 console.log("unable to start server: " + err);
});
