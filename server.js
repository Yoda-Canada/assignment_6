/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: __Tengzhen Zhao____ Student ID: __051440139_____ Date: __Mar 24,2020______
*
* Online (Heroku) Link: __https://desolate-gorge-83738.herokuapp.com/_
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

app.use(clientSessions({
    cookieName: "session",
    secret:"web322_A6",
    duration: 2*60*1000,
    activeDuration: 60*1000
}));

data.initialize()
.then(dataServiceAuth.initialize)
.then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});

const storage=multer.diskStorage({

    destination:  "./public/images/uploaded",    
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }) );

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });


function ensureLogin (req, res, next){
    if (!(req.session.user)){
            res.redirect("/login");
        }
        else{
            next();
        }
    }


app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/", function(req, res){
    //res.sendFile(path.join(__dirname, "/views/home.html"))
    res.render("home");
});

app.get("/about", function(req, res){
    //res.sendFile(path.join(__dirname, "/views/about.html"))
    res.render("about");
});

app.get("/images/add", ensureLogin, (req, res)=>{
    //res.sendFile(path.join(__dirname, "/views/addImage.html"))
    res.render("addImage");
});

app.get("/employees/add", ensureLogin, (req,res)=>{
    data.getDepartments()
    .then((data)=>{
        res.render("addEmployee", {departments: data});
    })
    .catch((err)=>{
        res.render("addEmployee", {departments: []}) 
    });
});


app.get("/images", ensureLogin, function(req, res){

    filesystem.readdir("./public/images/uploaded", function(err, items) {
        res.render("images",{images:items});
    });
});

app.get("/employees", ensureLogin, (req,res)=>{
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then((data)=>{
        if(data.length>0)
            res.render("employees",{employees: data.map(value=>value.dataValues)});
        else
            res.render("employees",{ message: "no results" });
    }).catch((err)=>{
        console.log(err);
        res.render({message: "no results"});
    })
}else if(req.query.department){
    data.getEmployeesByDepartment(req.query.department).then((data)=>{
        if(data.length>0) 
            res.render("employees",{employees: data.map(value=>value.dataValues)});
        else
            res.render("employees",{ message: "no results" });
    }).catch((err)=>{
        res.render({message: "no results"});
    })
}else if (req.query.manager) {
    data.getEmployeesByManager(req.query.manager).then((data) => {
        if(data.length>0) 
            res.render("employees",{employees: data.map(value=>value.dataValues)});
        else
            res.render("employees",{ message: "no results" });   
    }).catch((err) => {
      res.render({message: "no results"});
    })
} else {
    data.getAllEmployees().then((data) => {
        res.render("employees",{employees: data.map(value=>value.dataValues)});
      }).catch((err) => {
        console.log(err);
        res.render({message: "no results"});
      })
  }

});

app.get("/employee/:num", ensureLogin, (req, res) => {

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
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
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

app.get("/departments", ensureLogin, (req,res)=>{
    data.getDepartments().then((data)=>{
        if (data.length > 0)
            res.render("departments", {departments: data.map(value=>value.dataValues)});
        else 
            res.render("departments",{message: "no results"});   
    }).catch((err) => {
        console.log(err);
        res.render({message: "no results"});
    })
});

app.post("/employees/add",ensureLogin, (req, res) => {
    data.addEmployee(req.body).then(()=>{
      res.redirect("/employees"); 
    }).catch((err)=>{
        res.status(500).send("Unable to Add the Employee");
      });
  });

app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });

app.post("/employee/update", ensureLogin, (req, res) => {
    data.updateEmployee(req.body)
        .then(() => {
             res.redirect("/employees");
        })
        .catch(()=>{
            res.status(500).send("Unable to Update Employee");
        })
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
    .catch((err)=>{
        res.status(500).send("Unable to Add the Department");
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


app.get("/department/:num", ensureLogin, (req,res)=>{
    
    data.getDepartmentById(req.params.num)
    .then((data)=>{
        if(data==null)
            res.status(404).send("Department not found");
        else{res.render("department",{data:data}); }
    })
    .catch(()=>{
        res.status(404).send("Department Not Found"); 
    });
})

app.get("/employees/delete/:num",ensureLogin, (req,res)=>{
    
    data.deleteEmployeeByNum(req.params.num)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove Employee / Employee not found)");
    })
});
  
app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("register");
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


app.get("/logout", (req, res)=>{
    req.session.reset();
    res.redirect("/");
})

app.get("/userHistory", ensureLogin, (req, res)=>{
    res.render("userHistory",{user: req.session.user});
});



app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res)=>{
    res.status(404).send("404 Page");
});

