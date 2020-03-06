var filesystem=require("fs");
var employees=[];
var departments=[];

module.exports.getEmployeesByStatus = function (staId) {
  
    var EmpSta = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].status == staId) {
               EmpSta.push(employees[i]);
           }
       }

       if(EmpSta.length === 0) {
        var err = "getEmployeesByStatus error";
        reject({message: err});
       }  

    resolve (EmpSta);
    })
    return promise;

};

module.exports.getEmployeesByDepartment = function (depId) {

    var EmpDep = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].department == depId) {
               EmpDep.push(employees[i]);
           }
       }

       if(EmpDep.length === 0) {
        var err = "getEmployeesByDepartment() error.";
        reject({message: err});
       }  

    resolve (EmpDep);
    })
    return promise;

};

module.exports.getEmployeesByManager = function (manager) {
   
    var EmpM = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].employeeManagerNum == manager) {
               EmpM.push(employees[i]);
           }
       }
       
       if(EmpM.length === 0) {
        var err = "getEmployeesByManager() error.";
        reject({message: err});
       }  

    resolve (EmpM);
    })
    return promise;

};

module.exports.getEmployeeByNum = function (number) {
  
      var EmpNum;
      var promise = new Promise((resolve, reject) => {
        
         for (var i=0; i < employees.length; i++){
             if (employees[i].employeeNum == number) {
               
                 EmpNum = employees[i];
                 i = employees.length;
             }
         }
  
         if(EmpNum === "undefined") {
          var err = "getEmployeesByNum() error.";
          reject({message: err});
         }  
  
      resolve (EmpNum);
      })
      return promise;
  
  };



module.exports.initialize=function(){
    return new Promise((resolve, reject)=>{
    try{

        filesystem.readFile('./data/employees.json',(err,data)=>{
            if(err) throw err;
            employees=JSON.parse(data);
            
        });

        filesystem.readFile('./data/departments.json',(err,data)=>{
            if(err) throw err;
            departments=JSON.parse(data);
        });
    }catch(ex){
        reject("unable to read file");
    }
        resolve("initialize success.");
    });
    
}


module.exports.getAllEmployees=function(){
    return new Promise((resolve, reject)=>{
        
        if(employees.length==0){
            reject("zero results returned");
        }
        resolve(employees);
      })
      
}

module.exports.getManagers=function(){
    return new Promise(function(resolve, reject){
        var managerEmployees=[];
        for(var i=0; i<employees.length; i++){
            if(employees[i].isManager==true){
                managerEmployees.push(employees[i]);
            }
        }
        if(managerEmployees.length==0){
            reject("zero results returned");
        }
        resolve(managerEmployees);
        
      })
    
}

module.exports.getDepartments=function(){
    return new Promise((resolve, reject)=>{
        if(departments.length==0){
            reject("zero results returned");
        }
        resolve(departments);
      })
      
}

module.exports.addEmployee=function(employeeData){
    return new Promise((resolve, reject)=>{
        if (typeof (employeeData.isManager)==="undefined")
        
            employeeData.isManager=false;
        else
            employeeData.isManager=true;

        employeeData.employeeNum=employees.length+1;
        employees.push(employeeData);

        resolve(employees);
        
    })
}

module.exports.updateEmployee = function (employeeData) {

    var check = false;
    var promise = new Promise((resolve, reject) => {
        
        for (var i=0; i < employees.length; i++){
            if (employees[i].employeeNum == employeeData.employeeNum) {
                employees[i] = employeeData;
                check = true;
            }
        }
        if(check === false) {
         var err = "Cannot match employee.";
         reject({message: err});
        }  
        resolve (employees);
     })
     return promise;
};