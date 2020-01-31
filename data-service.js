var filesystem=require("fs");
var employees=[];
var departments=[];

module.exports.initialize=function(){
    var p=new Promise((resolve, reject)=>{
    try{

        filesystem.readFile('./data/employees.json',(err,data)=>{
            if(err) throw err;
            employees=JSON.parse(data);
            console.log("read employees success.");
        
        })

        filesystem.readFile('./data/departments.json',(err,data)=>{
            if(err) throw err;
            departments=JSON.parse(data);
            console.log("read departments success.");
        })
    }catch(e){
        reject("unable to read file");
    }
        resolve("initialize success.");
    })
    return p;
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
    return new Promise((resolve, reject)=>{
        var mangerEmployees=[];
        for(let i=0; i<employees.length; i++){
            if(employees[i].isManager==true){
                managerEmployees.push(employees[i]);
            }
        }
        if(mangerEmployees.length==0){
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