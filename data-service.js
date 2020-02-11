var filesystem=require("fs");
var employees=[];
var departments=[];

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