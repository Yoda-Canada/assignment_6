var express = require("express");
var app=express();
var path=require("path");
var HTTP_PORT=process.env.PORT||8080;

app.use(express.static('public'));

function onHttpStart(){
    console.log("Express http server listening on: "+HTTP_PORT);
}

app.get("/", function(req, res){
    res.sendFile(path.join(_dirname, "/views/home.html"))
});

app.get("/about", function(req, res){
    res.sendFile(path.join(_dirname, "/views/about.html"))
});

app.listen(HTTP_PORT, onHttpStart);