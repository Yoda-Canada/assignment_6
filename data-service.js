var filesystem=require("fs");
var employees=[];
var departments=[];
const Sequelize = require('sequelize');

var sequelize = new Sequelize('dbp7qkunmq4j95', 'psbyomygbqnqit', '7855ee754c0769bef1663d9edb8b59569840c1b7e8420fef4133d969d8ce4cf4', {
    host: 'ec2-52-23-14-156.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
    }
   });

   var Project = sequelize.define('Project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
});

sequelize.sync().then(function () {

    // create a new "Project" and add it to the database
    Project.create({
        title: 'Project1',
        description: 'First Project'
    }).then(function (project) {
        // you can now access the newly created Project via the variable project
        console.log("success!")
    }).catch(function (error) {
        console.log("something went wrong!");
    });
});

const Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});



module.exports.getEmployeesByStatus = function (staId) {
  
    return new Promise(function (resolve, reject) {
        reject();
       });

};

module.exports.getEmployeesByDepartment = function (depId) {

    return new Promise(function (resolve, reject) {
        reject();
       });

};

module.exports.getEmployeesByManager = function (manager) {
   
    return new Promise(function (resolve, reject) {
        reject();
       });

};

module.exports.getEmployeeByNum = function (number) {
  
    return new Promise(function (resolve, reject) {
        reject();
       });
  
  };



module.exports.initialize=function(){
    return new Promise(function (resolve, reject) {
        reject();
       });
    
};


module.exports.getAllEmployees=function(){
    return new Promise(function (resolve, reject) {
        reject();
       });
      
};

module.exports.getManagers=function(){
    return new Promise(function (resolve, reject) {
        reject();
       });
    
};

module.exports.getDepartments=function(){
    return new Promise(function (resolve, reject) {
        reject();
       });
};

module.exports.addEmployee=function(employeeData){
    return new Promise(function (resolve, reject) {
        reject();
       });
};

module.exports.updateEmployee = function (employeeData) {

    return new Promise(function (resolve, reject) {
        reject();
       });
};