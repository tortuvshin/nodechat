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

var clients = {};
var pool =  mysql.createPool({
    host : "localhost",
    user : "root",
    password: "",
    database: "nodejschat"
  });

var Database;

pool.getConnection(function(error,conn){
    Database = conn;
    if(error){
        console.log("Database connection error!!! "+error); 
        return;
    }
});

SocketServer.sockets.on('connection', function(socket){
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
        if(data.user.username == '' || data.user.password == '' || data.user.email == ''){
                socket.emit("RegisterNulls");
            }
            else{
                Database.query('SELECT * FROM `users` WHERE `username` LIKE "'+data.user.username+'"', function(error,result)
                {
                    if(result.length > 0){
                        socket.emit("AlreadyUser");
                    }
                    else{
                        Database.query('INSERT INTO users VALUES ("' + data.user.username +
                                                            '","' + data.user.password + 
                                                            '","'+ data.user.email +'")',
                                                            function(error,result)
                        {
                            if(error)
                            {
                                throw error;
                            }
                            else{
                                    socket.emit("RegisterCorrect");
                                    console.log("Result : "+result);
                                }
                            console.log("Error : "+error);
                        })
                    }
                })
            } 
    })

    socket.on("LogIn", function(data){  
        Database.query('SELECT * FROM `users` WHERE `username` LIKE "'
            +data.user.username+'" AND `password` LIKE "'
            +data.user.password+'"',
        function(error,result)
        {
            if(error)
            {
                throw error;
            }
            else if (data.user.username == '' || data.user.password == ''){
                socket.emit("LoginNulls");
            }
            else if(result.length > 0){
                console.log("server login Correct");
                socket.on("LoginClient", function(name){
                    clients[SessionID].name = name;
                    clients[SessionID].authorized = true;
                    var list = [];
                    Object.keys(clients).forEach(function(id, i){
                        if(clients[id].authorized == true) 
                            list.push({ 
                                id: id,
                                name: clients[id].name, 
                                date: clients[id].date 
                            })
                    })
                    socket.emit("OnlineUsers", JSON.stringify(list));
                    Object.keys(clients).forEach(function(id, i){
                        if(clients[id].authorized == true && id != SessionID) {
                            clients[id].sockets.forEach(function(sock, i){
                                sock.emit("OnlineUsers", JSON.stringify(list));
                                console.log(sock.emit("OnlineUsers", JSON.stringify(list)));
                            })
                        }
                    })    
                })
                console.log("LoginCorrect");
                socket.emit("LoginCorrect");   
            }
            else{

                console.log("server LoginIncorrect: "+data.user.username);
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