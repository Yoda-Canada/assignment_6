var filesystem=require("fs");
var employees=[];
var departments=[];
const Sequelize = require('sequelize');

var sequelize = new Sequelize('dcn3nqsi864ec4', 'ugypnljmcgxhtf', '6559aef653e89b414543cdc950b5501fedd5f95060e6017b0ca0aac96e5542f8', {
    host: 'ec2-35-174-88-65.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
    }
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