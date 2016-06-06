const http = require( 'http' );
const fs = require('fs');
const ps = require("path");
const io = require('socket.io');
const mysql =  require('mysql');
const applicationHost = process.env.IP;
const applicationPort = process.env.PORT;
const url = require("url");

var sqlite3 = require('sqlite3').verbose();

var dbName = "db/chat.db";
var db = createDatabase(dbName);


var WebServer = http.createServer( function( req, res ) {
    const content= {};
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

var clients = {};

function createDatabase(file){
    var db = new sqlite3.Database(file);
    if(!fs.existsSync(file)){
        console.log("creating database file");
        fs.openSync(file, "w");
        db.run("CREATE TABLE users (username TEXT, password TEXT, email TEXT)", function(createResult){
            if(createResult) throw createResult;
        });
        
        console.log("database initialized");
    }

    return db;
}



SocketServer.sockets.on('connection', function(socket){
    console.log("new user connected");
    var cookies = cookie(socket.handshake.headers.cookie);
    var SessionID = decodeURIComponent(cookies["SessionID"]);
    console.log(socket.handshake);
    if(SessionID === "undefined" || clients[SessionID] === undefined) {
        var ip = socket.handshake.address.address;
        var port = socket.handshake.address.port;
        var stamp = getStamp();
        SessionID = hash(ip + port + stamp);
        
        clients[SessionID] = {};
        clients[SessionID].sockets = [];
        clients[SessionID].authorized = false;
        clients[SessionID].ip = socket.handshake.address;
    }
    socket.emit("InitSession", { 
        sid: SessionID ,
        name : clients[SessionID].name,
        authorized :  clients[SessionID].authorized,
        date : new Date()

    });
    clients[SessionID].sockets.push(socket);
    console.log("=================InitSession================="+clients[SessionID].sockets.push(socket));
    
    socket.on("Message", function(data){
        var message = JSON.parse(data);
        var sendingMessage = message;
        sendingMessage.date = new Date().toISOString().
        replace(/T/, ' ').    
        replace(/\..+/, '')  ;
        sendingMessage.from = SessionID;
        sendingMessage.name = clients[SessionID].name;
        
        clients[message.end_client].sockets.forEach(function(socket, i){
            socket.emit("ChatWindow");
            socket.emit("Message", JSON.stringify(sendingMessage));
            console.log("Sending message server to client to client");
        })
    })

    socket.on("PublicMessage", function(data){ 
        var message = JSON.parse(data);
        var sendingMessage = message;
        sendingMessage.date = new Date().toISOString().
        replace(/T/, ' ').    
        replace(/\..+/, '')  ;
        sendingMessage.from = SessionID;
        sendingMessage.name = clients[SessionID].name;
        socket.emit("PublicMessage", JSON.stringify(sendingMessage));
        console.log("Sending message server to clients");
    })

    socket.on("Register", function(data){
        
        db.each('SELECT * FROM `users` WHERE `username` LIKE "'
            +data.user.username+'"', function(error,result)
        {
            if(result.length > 0){
                socket.emit("AlreadyUser");
            }
            else {
                db.run('INSERT INTO users VALUES ("' + data.user.username +
                                                    '","' + data.user.password + 
                                                    '","'+ data.user.email +'")',
                                                    function(error,result)
                {
                    if(error)
                    {
                        throw error;
                        console.log("Error : "+error);
                    }
                    else{
                            socket.emit("RegisterCorrect");
                            console.log("New user" , data.user.name);
                        }
                })
            }
        })
     
    })

    socket.on("LogIn", function(data){  
        db.each('SELECT * FROM `users` WHERE `username` LIKE "'
            +data.user.username+'" AND `password` LIKE "'
            +data.user.password+'"',
        function(error,result)
        {
            if(error)
            {
                throw error;
            }
            else if(result.length > 0){
                socket.emit("LoginClient");
                socket.emit("MainShow");
                socket.emit("LoginCorrect"); 
            }
            else{
                socket.emit("LoginIncorrect");
            }
        })   
    })
    socket.on("LoginClient", function(name){
        clients[SessionID].name = name;
        clients[SessionID].authorized = true;
        var list = [];
        Object.keys(clients).forEach(function(id, i){
            if (clients[id].authorized == true) list.push({
                id: id, name:clients[id].name,
                date:clients[id].date
            })
        })
        socket.emit("OnlineUsers",JSON.stringify(list));
        Object.keys(clients).forEach(function(id, i){
            if(clients[id].authorized == true && id != SessionID) {
                clients[id].sockets.forEach(function(sock, i){
                    sock.emit("OnlineUsers", JSON.stringify(list));
                })
            }
        }) 
    })
    socket.on("disconnect", function(){
        console.log("user disconnected");
        if (SessionID === "") return;
        if (clients[SessionID] && clients[SessionID].sockets.length == 0){
            setTimeout(function(){
                if (clients[SessionID].sockets.length == 0) {
                    delete(clients[SessionID]);
                    Object.keys(clients).forEach(function(sock, i){
                        clients[id].sockets.forEach(function(sock, i){
                            sock.emit("OnlineUsers",JSON.stringify(list));  
                        })
                    })      
                    console.log("user disconnected");
                };
            },2000)
        };
    })
});

WebServer.listen( applicationPort );

console.log("Connected server localhost:"+applicationPort+" listen");

function getStamp(){
    return "ToRoo software developer. " + (new Date()).getTime();
}

function hash(pass) {
    var salt = "ToRoo.";
    var h = require("crypto").createHash('sha512');
    h.update(pass);
    h.update(salt);
    return h.digest('base64');
};

function cookie(cookies_text){
    var cookies = {};
    if(cookies_text){
        cookies_text.split(";").forEach(function(cookie){
            cookies[cookie.split("=")[0].trim()] = cookie.split("=")[1].trim();
        });
    }
    return cookies
}