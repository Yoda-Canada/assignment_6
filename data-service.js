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