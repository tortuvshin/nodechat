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
    require(["/table.js","/button.js","/textarea.js","linklabel.js","label.js", "textfield.js","chat.js"],
        function(table, button, textarea, linklabel, label,textfield,chat){

            var mainTable = new table();
            var headerTable = new table();
            var chatTable = new table();
            var groupChatTable = new table();
            var infoTable = new table();
            var buddyTable = new table();
            var onlineUsersTable = new table();

            var TextArea = new textarea();
            var TextField = new textfield();
            var SendButton = new button("Илгээх");
            var loginButton = new button("Нэвтрэх");
            var registerButton = new button("Бүртгүүлэх");
            var onlineUserName = new linklabel();
            doc.append(mainTable);

            TextArea._view.attr("class","TextArea");
            TextField._view.attr("class", "TextField");


            mainTable.addRow();
            mainTable.addRow();
            mainTable.addCell(0);
            mainTable.addCell(1);
            mainTable.addCellContent(0,0,headerTable);
            mainTable.addCellContent(1,0,chatTable);

            headerTable.addRow();
            headerTable.addCell(0);
            headerTable.addCellContentOneRow(0,0,loginButton);
            headerTable.addCellContentOneRow(0,0,registerButton);

            chatTable.addRow();
            chatTable.addCell(0);
            chatTable.addCell(0);
            chatTable.addCell(0);
            
            chatTable.addCellContentOneRow(0,0,infoTable);
            chatTable.addCellContentOneRow(0,1,groupChatTable);
            chatTable.addCellContentOneRow(0,2,buddyTable);

            var infoHeader = new label("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspХЭРЭГЛЭГЧИЙН МЭДЭЭЛЭЛ");
            infoHeader._view.attr("class","infoHeader");
            infoTable.addRow();
            infoTable.addRow();
            infoTable.addCell(0);
            infoTable.addCell(1);
            infoTable.addCellContent(0,0,infoHeader);

            var groupChatHeader = new label("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspГРҮПП ЧАТ");
            groupChatHeader._view.attr("class","groupChatHeader");
            groupChatTable.addRow();
            groupChatTable.addRow();
            groupChatTable.addRow();
            groupChatTable.addCell(0);
            groupChatTable.addCell(1);
            groupChatTable.addCell(2);
            groupChatTable.addCellContent(0,0,groupChatHeader);
            groupChatTable.addCellContent(1,0,TextArea);
            groupChatTable.addCellContentOneRow(2,0,TextField);

            var buddyHeader = new label("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspОНЛАЙН ХЭРЭГЛЭГЧИД");
            buddyHeader._view.attr("class","buddyHeader");
            buddyTable.addRow();
            buddyTable.addRow();
            buddyTable.addCell(0);
            buddyTable.addCell(1);
            buddyTable.addCellContent(0,0,buddyHeader);
            mainTable._view.attr("class","mainTable");
            headerTable._view.attr("class","headerTable");

            chatTable._view.attr("class","chatTable");
            infoTable._view.attr("class","infoTable");
            groupChatTable._view.attr("class","groupChatTable");
            buddyTable._view.attr("class","buddyTable");
            onlineUsersTable._view.attr("class","onlineUsersTable");

            window.socket = io.connect();
            var selectedUser = {};
            window.chatWindows = {};

            socket.on('connect', function(){
                socket.on("InitSession", function(data){
                    jQuery.cookie("SessionID", 
                        data.sid, 
                        { 
                            path : '/'
                        }
                    );
                    if(data.authorized != true){
                        require(["login.js"],function(LoginWindow){
                            var loginWindow = new LoginWindow();
                        })
                    } else {
                        alert("Login correct user name: " +data.name);
                        socket.emit("LoginClient", data.name);
                    }
    
            });
            jQuery(loginButton._view).click(function(){
                require(["login.js"],function(LoginWindow){
                    var loginWindow = new LoginWindow();
                })
            })
            
            jQuery(registerButton._view).click(function(){
                require(["register.js"],function(RegisterWindow){
                    var RegisterWindow = new RegisterWindow();
                })
            })

            socket.on("OnlineUsers", function(data){
                var online = JSON.parse(data);
                online.forEach(function(client, i){
                    onlineUsersTable.addRow();
                    onlineUsersTable.addCell(i);
                    onlineUserName.setText(client.name);
                    onlineUsersTable.addCellContent(i,0,onlineUserName);
                    buddyTable.addCellContent(1,0,onlineUsersTable);
                    jQuery(onlineUserName._view).on("click",function(){
                        selectedUser = {
                            name : client.name, 
                            id : client.id
                        };
                        if (chatWindows[client.id]) {
                            alert("Already");
                        }else{
                            var chatWindow = new chat();
                            var chatText = new label("user");
                            var chatTextArea = new textarea();
                            var chatTextField = new textfield();
                            var chatCloseButton = new button("X");
                            var chatHideButton = new button("_");
                            var chatShowButton = new button("[]");
                            chatShowButton._view.hide();

                            chatText._view.attr("class","chatText");
                            chatTextArea._view.attr("class","chatTextArea");
                            chatTextField._view.attr("class","chatTextField");
                            chatCloseButton._view.attr("class","closeButton");
                            chatHideButton._view.attr("class","hideButton");
                            chatShowButton._view.attr("class","showButton");
                            
                            chatWindows[client.id] = chatWindow;
                            chatWindows[client.id]._view.css({"right": Object.keys(chatWindows).length * 100 + 'px'});

                            $(chatTextField._view).keypress(function(e){
                                if(e.keyCode == 13){
                                    var text = chatTextField.getText();
                                    var message = {
                                        text: text,
                                        end_client : selectedUser.id
                                    }
                                    socket.emit("msg", JSON.stringify(message));
                                    chatTextArea.appendText(selectedUser.name + " : " + text);
                                    chatTextField.setText("");
                                    }
                            })  
                            socket.on("msg", function(data){
                                var message = JSON.parse(data);
                                chatTextArea.appendText(message.name + ' : ' + message.text +' at '+message.date);
                            })
                            $(chatCloseButton._view).on("click",function(){
                                delete chatWindows[client.id];
                                chatWindow._view.remove();
                                delete chatWindow;
                            })
                            $(chatHideButton._view).on("click",function(){
                                chatTextArea._view.remove();
                                chatTextField._view.remove();
                                chatSendButton._view.remove();
                                chatHideButton._view.remove();
                                chatShowButton._view.show();
                            })
                            $(chatShowButton._view).on("click",function(){
                                chatText._view.show();
                                chatTextArea._view.show();
                                chatTextField._view.show();
                                chatSendButton._view.show();
                                chatCloseButton._view.show();
                                chatHideButton._view.show();
                                chatShowButton._view.remove();
                            })
                            chatWindow.addControl(chatTextArea);
                            chatWindow.addControl2(chatTextField);
                            chatWindow.addControl5(chatText);
                            chatWindow.addControl6(chatHideButton);
                            chatWindow.addControl4(chatCloseButton);
                            chatWindow.addControl1(chatShowButton);
                            chatText.setText(selectedUser.name);
                        }

                    })
                })
            })
        })
        socket.on("Message", function(data){
            var message = JSON.parse(data);
            TextArea.appendText(message.name + ' : ' + message.text +' at '+message.date);
            console.log("Message"+message.name + ' : ' + message.text +' at '+message.date);
        })
        jQuery(TextField._view).keypress(function(e){
            if(e.keyCode == 13){
                var text = TextField.getText();
                var message = {
                    text: text,
                    //end_client : selectedUser.id      
                }
                socket.emit("Message", JSON.stringify(message));
                TextArea.appendText(name + " : " + text);
                TextField.setText("");
            }
        })  
    })
});
