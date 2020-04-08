var mongoose = require("mongoose");
var Schema  = mongoose.Schema;
var bcrypt = require('bcryptjs');
var userSchema = new Schema({
    "userName":{
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory":[{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://tzhao16:<131131@Ztz>@cluster0-9jngd.mongodb.net/test?retryWrites=true&w=majority");
        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
           User = db.model("Users", userSchema);
           resolve();
        });
    });
};

/*
module.exports.registerUser = function (userData){
    return new Promise(function (resolve, reject) {
        if( userData.password != userData.password2 ){
            reject ("Passwords do not match");
        }
        else{        
            let newUser = new User(userData);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userData.password, salt, function(err, hash) {
                    if (err){
                        reject("There was an error encrypting the password");
                    }
                    else{
                        newUser.password = hash;
                        newUser.save()
                        .then(()=>{
                            resolve();
                        })
                        .catch( (err)=>{
                            if (err.code == 11000){
                                reject("User Name already taken");                 
                            }
                            else{
                                reject("There was an error creating the user: err"+err);
                            }
                        }); 
                    }
                });
            });

        }
    });
}

*/