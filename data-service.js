//var filesystem=require("fs");
//var employees=[];
//var departments=[];
const Sequelize = require('sequelize');

var sequelize = new Sequelize('dc7lj9uq5kn7ar', 'hbdkntvqvfoasm', '555fd058fdb17ea50062589bd6a51969ccdab5d869c7c356af56ccd55154f76f', {
    host: 'ec2-52-71-231-180.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
    }
   });

   sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        res.status(500).send('Unable to connect to the database:');
    });


    var Employee = sequelize.define('Employee', {
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

    module.exports.initialize = function (){
        return new Promise(function (resolve, reject) {
            sequelize.sync()
            .then(()=>{
                resolve("have sync the database");
            })
            .catch(()=>{
                reject("unable to sync the database");
            });
        });
    };
    
    module.exports.getAllEmployees = function (){
        return new Promise(function (resolve, reject) {
            Employee.findAll()
            .then((data)=>{
                resolve(data);
            })
            .catch(()=>{
                reject("no employee returned");
            });   
        });
    };
   
module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                status: status
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                status: status
            }
        })))
        .catch(()=>reject("no employee returned")) 
    });
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                department: department
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                department: department
            }
        })))
        .catch(()=>reject("no employee returned")) 
    });
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                employeeManagerNum: manager
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                employeeManagerNum: manager
            }
        })))
        .catch(()=>reject("no employee returned")) 
    });
}

module.exports.getEmployeeByNum = function(num){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                employeeNum: num
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                employeeNum: num
            }
        })))
        .catch(()=>reject("no employee returned")) 
    });
}
    
    
    module.exports.addEmployee = function(employeeData){
        return new Promise(function (resolve, reject) {
            employeeData.isManager = (employeeData.isManager) ? true : false;
            for (const prop in employeeData) {
                if (employeeData[prop] == "") employeeData[prop] = null;
            };
            Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            })
            .then(()=>{
                console.log("successfully created a new employee");
                resolve(Employee);
            })
            .catch(()=>{
                reject("unable to create employee");
            });   
        });
    };
    
    module.exports.updateEmployee = function(employeeData){
        return new Promise(function (resolve, reject) {
            employeeData.isManager = (employeeData.isManager) ? true : false;
            for (const prop in employeeData) {
                if (employeeData[prop] == "") employeeData[prop] = null;
            };
            Employee.update(
            {
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            },
            {
                where:{employeeNum:employeeData.employeeNum}
            })
            .then(()=>{
                console.log("successfully update a employee");
                resolve(Employee);
            })
            .catch(()=>{
                reject("unable to update employee");
            });   
        });
    };
    
    module.exports.deleteEmployeeByNum = function(num){
        return new Promise(function(resolve,reject){
            Employee.destroy({
                where:{employeeNum:num}
            })
            .then(()=>{
                resolve("destroyed an employee");
            })
            .catch(()=>{
                reject("destroy employee was rejected");
            })
        })
    }
    
    module.exports.getDepartments = function(){
        return new Promise(function (resolve, reject) {
            Department.findAll()
            .then((data)=>{
                resolve(data);
            })
            .catch(()=>{
                reject("no department returned");
            });   
        });
    };
    
    /*module.exports.getDepartmentById = function (num){
        return new Promise(function (resolve, reject) {
            Department.findAll({
                where:{departmentId:num}
            })
            .then((data)=>{
                resolve(data[0]);
            })
            .catch(()=>{
                reject("no department returned");
            })
        });
    };*/
    exports.getDepartmentById = function(id){
        return new Promise((resolve, reject) => {
           Department.findAll({
                where:{
                    departmentId: id
                }
            })
            .then(()=>resolve(Department.findAll({
                where:{
                    departmentId: id
                }
            })))
            .catch(()=>reject("no department returned")) 
        });
    }
    
    module.exports.addDepartment = function(departmentData){
        return new Promise(function (resolve, reject) {
            for (const prop in departmentData) {
                if (departmentData[prop] == "") departmentData[prop] = null;
            };
            Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            })
            .then(()=>{
                console.log("successfully created a new department");
                resolve(Department);
            })
            .catch(()=>{
                reject("unable to create department");
            });   
        });
    };
    
    module.exports.updateDepartment = function(departmentData){
        return new Promise(function (resolve, reject) {
            for (const prop in departmentData) {
                if (departmentData[prop] == "") departmentData[prop] = null;
            };
            Department.update(
            {
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            },
            {
                where:{departmentId:departmentData.departmentId}
            })
            .then(()=>{
                console.log("successfully update a department");
                resolve(Department);
            })
            .catch(()=>{
                reject("unable to update department");
            });   
        });
    };
    
    

    module.exports.deleteDepartmentById = function(id) {
        return new Promise(function(resolve, reject) {
            sequelize.sync().then(() => {
                    resolve(Department.destroy({
                        where:{
                            employeeNum: id
                        }}));
            }).catch((err) => {
                reject();
            });
        });
    }
    
   
   