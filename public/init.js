/*
Created by Toroo
*/
require.config({
    paths: {
        "jquery" : '/assets/lib/jquery-2.0.3.min',
        "jquery_cookie" : '/assets/lib/jquery.cookie.min',
        "text":'/assets/lib/text.min',
        "socket_io":'/socket.io/socket.io',
        "css":'/assets/lib/css.min'
    },
    shim: {
            "socket_io": {
                exports: 'io'
            }
        }
});

require(["socket_io","jquery","text","css", "jquery_cookie", "/body.js", "css!/style.css"], function(io){
    window.doc = new Body();
    require(["/table.js","/button.js","/textarea.js","linklabel.js","label.js", "textfield.js"],
        function(table, button, textarea, linklabel, label,textfield){

            var mainTable = new table();
            var headerTable = new table();
            var chatTable = new table();
            var publicChatTable = new table();
            var onlineUsersTable = new table();

            var publicMessageTextArea = new textarea();
            var publicMessageTextField = new textfield();
            var publicMessageSendButton = new button("Илгээх");
            var loginButton = new button("Нэвтрэх");
            var signupButton = new button("Бүртгүүлэх");

            doc.append(mainTable);

            mainTable.addRow();
            mainTable.addRow();
            mainTable.addCell(0);
            mainTable.addCell(1);
            mainTable.addCellContent(0,0,headerTable);
            mainTable.addCellContent(1,0,chatTable);

            headerTable.addRow();
            headerTable.addCell(0);
            headerTable.addCellContentOneRow(0,0,loginButton);
            headerTable.addCellContentOneRow(0,0,signupButton);

            chatTable.addRow();
            chatTable.addRow();
            chatTable.addCell(0);
            chatTable.addCell(0);
            chatTable.addCell(1);
            chatTable.addCell(1);
            
            chatTable.addCellContent(0,0,publicChatTable);
            chatTable.addCellContent(0,1,onlineUsersTable);

            publicChatTable.addRow();
            publicChatTable.addRow();
            publicChatTable.addCell(0);
            publicChatTable.addCell(1);
            publicChatTable.addCellContent(0,0,publicMessageTextArea);
            publicChatTable.addCellContentOneRow(1,0,publicMessageTextField);
            publicChatTable.addCellContentOneRow(1,0,publicMessageSendButton);

            mainTable._view.attr("class","mainTable");
            headerTable._view.attr("class","headerTable");
            chatTable._view.attr("class","chatTable");
            publicChatTable._view.attr("class","publicChatTable");

            window.socket = io.connect();

            var selectedUser = {};
            socket.on('connect', function(){
                socket.on("InitSession", function(data){
                    jQuery.cookie("SessionID", data.sid, { path : '/'});
                    jQuery(loginButton._view).click(function(){
                        require(["login.js"],function(LoginWindow){
                            var loginWindow = new LoginWindow();
                        })
                    })
                });
                socket.on("OnlineUsers", function(data){
                    var online = JSON.parse(data);
                    online.forEach(function(client, i){
                        onlineUsersTable.addRow();
                        onlineUsersTable.addCell(i);
                        var onlineUserName = new linklabel();
                        onlineUserName.setText(client.name);
                        onlineUsersTable.addCellContent(i,0,onlineUserName);
                    })
                })
            })
            socket.on("Message", function(data){
                var message = JSON.parse(data);
                publicMessageTextArea.appendText(message.name + ' : ' + message.text +' at '+message.date);
                console.log("Message"+message.name + ' : ' + message.text +' at '+message.date);
            })
            jQuery(publicMessageSendButton._view).on("click", function(){
                var text = publicMessageTextField.getText();
                var message = {
                    text: text,
                    //end_client : selectedUser.id      
                }
                socket.emit("Message", JSON.stringify(message));
                publicMessageTextArea.appendText(name + " : " + text);
            })  
        })
});
