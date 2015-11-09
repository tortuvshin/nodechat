var http = require( 'http' );
var fs = require('fs');
var ps = require("path");
var io = require('socket.io');
var mysql =  require('mysql');
var applicationPort = 8000;

var WebServer = http.createServer( function( req, res ) {
    var content= {};
    content.code = 200;
    content.type = "text/plain";

    console.log(req.url);
    
    if (req.url== "/"){
         content.path = "/public/index.html";
    }
    else{
        content.path = "/public"+ req.url;
    }
    if(ps.extname(content.path) !== ""){
        switch(ps.extname(content.path)){
            case ".html" : case "" : content.type  = "text/html"; break;
            case ".css" : content.type  = "text/css"; break;
            case ".js" :  content.type  = "text/javascript"; break;
            case ".swf" : content.type  = "application/x-shockwave-flash"; break;
            default :
        }
        content.data = fs.existsSync(__dirname +content.path)
        ?fs.readFileSync(__dirname +content.path):"404";
    } else {
        content.type  = "text/html";
        content.data = fs.readFileSync(__dirname +"/public/index.html");
    }
    res.writeHead( content.code, { 'content-type': content.type });
    res.end(content.data);
});

var SocketServer = io.listen(WebServer, {log : false});

SocketServer.sockets.on('connection', function(socket){

});

WebServer.listen( applicationPort );
console.log("Connected server localhost:"+applicationPort+" listen");

