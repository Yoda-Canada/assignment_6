var mongoose = require("mongoose");
var Schema  = mongoose.Schema;
//var bcrypt = require('bcryptjs');
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