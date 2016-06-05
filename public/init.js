/*
Created by Toroo 
*/
require.config({
    paths: {
        "jquery" : '/lib/jquery-2.2.3.min',
        "jquery_cookie" : '/lib/jquery.cookie.min',
        "text" : '/lib/text.min',
        "socket_io" : '/socket.io/socket.io',
        "css" : '/lib/css.min'
    },
    shim: {
            "socket_io": {
                exports: 'io'
            }
        }
});

require(["socket_io","jquery","text","css", "jquery_cookie", "/api/body.min.js", "css!/style.css"], function(io){
    window.doc = new Body();
    require(["/api/table.min.js","/api/button.min.js","/api/textarea.min.js","/api/linklabel.min.js",
        "/api/label.min.js", "/api/textfield.min.js","/chat.min.js", "/api/fileUploadButton.js"],
        function(table, button, textarea, linklabel, label,textfield,chat,uploadButton){

            var mainTable = new table();
            var headerTable = new table();
            var chatTable = new table();
            var groupChatTable = new table();
            var infoTable = new table();
            var buddyTable = new table();

            var TextArea = new textarea();
            var TextField = new textfield();
            var SendButton = new button("Илгээх");
            var loginButton = new button("Нэвтрэх");
            var registerButton = new button("Бүртгүүлэх");

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

            var infoHeader = new label("ХЭРЭГЛЭГЧИЙН МЭДЭЭЛЭЛ");
            infoHeader._view.attr("class","infoHeader");
            infoTable.addRow();
            infoTable.addRow();
            infoTable.addCell(0);
            infoTable.addCell(1);
            infoTable.addCellContent(0,0,infoHeader);

            var groupChatHeader = new label("ГРҮПП ЧАТ");
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

            var buddyHeader = new label("ОНЛАЙН ХЭРЭГЛЭГЧИД");
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

            mainTable._view.hide();
            window.socket = io.connect();
            var fileReader;
            var fileName;
            var selectedFile;
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
                            mainTable._view.hide();
                            var loginWindow = new LoginWindow();

                        })
                    } else {
                        mainTable._view.show();
                        alert("Login correct user name: " +data.name);
                        socket.emit("LoginClient", data.name);
                        var username = new label(data.name);
                        infoTable.addCellContentOneRow(1,0,username);
                }
                socket.on("OnlineUsers", function(data){
                    var online = JSON.parse(data);
                    var onlineUsersTable = new table();
                    onlineUsersTable._view.attr("class","onlineUsersTable");
                    online.forEach(function(client, i){
                        onlineUsersTable.addRow();
                        onlineUsersTable.addCell(i);
                        var onlineUserName = new linklabel();
                        onlineUserName.setText(client.name);
                        onlineUsersTable.addCellContent(i,0,onlineUserName);

                        jQuery(TextField._view).keypress(function(e){
                            if(e.keyCode == 13){

                                var text = TextField.getText();
                                var message = {
                                    text: text
                                }
                                socket.emit("PublicMessage", JSON.stringify(message));
                                TextArea.appendText(name + " : " + text);
                                TextField.setText("");
                            }
                        })
                        socket.on("PublicMessage", function(data){
                            var message = JSON.parse(data);
                            TextArea.appendText(message.name + ' : ' + message.text +' at '+message.date);
                            console.log("Message"+message.name + ' : ' + message.text +' at '+message.date);
                        })
                        
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
                                chatWindows[client.id]._view.css({"right": Object.keys(chatWindows).length * 150 + 'px'});

                                $(chatTextField._view).keypress(function(e){
                                    if(e.keyCode == 13){
                                        var text = chatTextField.getText();
                                        var message = {
                                            text: text,
                                            end_client : selectedUser.id
                                        }
                                        socket.emit("Message", JSON.stringify(message));
                                        chatTextArea.appendText(text);
                                        chatTextField.setText("");
                                    }
                                }) 
                                socket.on("Message", function(data){
                                    var message = JSON.parse(data);
                                    chatTextArea.appendText(message.text +' at '+message.date);
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
                               //chatWindow.addControl3(chatFileUploadButton);
                                chatWindow.addControl6(chatHideButton);
                                chatWindow.addControl4(chatCloseButton);
                                chatWindow.addControl1(chatShowButton);
                                chatText.setText(selectedUser.name);
                            }
                            
                        })
                        socket.on("ChatWindow",function(data){
                            
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
                                var chatCloseButton = new button("");
                                var chatHideButton = new button("");
                                var chatShowButton = new button("");
                                chatShowButton._view.hide();
                                window.addEventListener("load", Ready)


                                function Ready(){ 

                                    if(window.File && window.FileReader){
                                        $(chatFileUploadButton._view).addEventListener('click', StartUpload)

                                        $(chatFileUploadButton._view).addEventListener('change', FileChosen)
                                    }
                                    else
                                    {
                                        alert("HI");
                                    }
                                }
                                chatText._view.attr("class","chatText");
                                chatTextArea._view.attr("class","chatTextArea");
                                chatTextField._view.attr("class","chatTextField");
                                chatCloseButton._view.attr("class","closeButton");
                                chatHideButton._view.attr("class","hideButton");
                                chatShowButton._view.attr("class","showButton");
                                
                                chatWindows[selectedUser.id] = chatWindow;
                                chatWindows[selectedUser.id]._view.css({"right": Object.keys(chatWindows).length * 150 + 'px'});

                                $(chatTextField._view).keypress(function(e){
                                    if(e.keyCode == 13){
                                        var text = chatTextField.getText();
                                        var message = {
                                            text: text,
                                            end_client : selectedUser.id
                                        }
                                    
                                        socket.emit("Message", JSON.stringify(message));
                                        chatTextArea.appendText(text);
                                        chatTextField.setText("");
                                    }
                                })  
                                socket.on("Message", function(data){
                                    var message = JSON.parse(data);
                                    chatTextArea.appendText(message.text +' at '+message.date);
                                })
                                $(chatCloseButton._view).on("click",function(){
                                    delete chatWindows[client.id];
                                    chatWindow._view.remove();
                                   // delete chatWindow;
                                })
                                $(chatHideButton._view).on("click",function(){
                                    chatTextArea._view.remove();
                                    chatTextField._view.remove();
                                    chatSendButton._view.remove();
                                    chatHideButton._view.remove();
                                    chatShowButton._view.show();
                                })
                                $(chatFileUploadButton).on("click",function(){
                                    selectedFile = evnt.target.files[0]
                                    console.log(selectedFile)
                                    chatTextArea.appendText(selectedFile.name);
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
                    buddyTable.addCellContent(1,0,onlineUsersTable);
                })
            });
            jQuery(loginButton._view).click(function(){
                require(["login.js"],function(LoginWindow){
                    var loginWindow = new LoginWindow();
                    loginWindow.url = "/login";
                    navigate(this.url);
                    mainTable._view.hide();
                })
            })   
            jQuery(registerButton._view).click(function(){
                require(["register.js"],function(RegisterWindow){
                    var RegisterWindow = new RegisterWindow();
                    RegisterWindow.url = "/register";
                    navigate(this.url);
                    mainTable._view.hide();
                })
            })
            socket.on("MainShow",function(){
                mainTable._view.show();
            })

            function FileChosen(evnt) {
                selectedFile = evnt.target.files[0]
                console.log(selectedFile)
                chatTextArea.appendText(selectedFile.name);
            }

            function StartUpload(){

                fileReader = new FileReader()
                 chatTextArea.appendText(fileName); 
                fileReader.onload = function(evnt){
                    socket.emit('Upload', { 'Name' : name, Data : evnt.target.result })
                }
                console.log("About to send Start")
                socket.emit('Start', { 'Name' : name, 'Size' : selectedFile.size })
            }

            socket.on('MoreData', function (data){
                var Place = data['Place'] * 524288 //The Next Blocks Starting Position
                var NewFile //The Variable that will hold the new Block of Data

                if(selectedFile.webkitSlice) {
                    NewFile = selectedFile.webkitSlice(Place, Place + Math.min(524288, (selectedFile.size-Place)))
                }
                else {
                    NewFile = selectedFile.slice(Place, Place + Math.min(524288, (selectedFile.size-Place)))
                }
                fReader.readAsBinaryString(NewFile)
            })
        })
       
        function navigate(url){
            if (!url) url = "/"
                history.pushState(url, url, url);
        }
        window.onbeforeunload = function(){
            socket.emit("disconnect");
        };
    })
});
