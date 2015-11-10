define(["/table.js","/button.js","/textfield.js","/label.js",'css!/style.css'], 
    function(table,button,textfield,label){
    var RegisterWindow = function(){

        var own = this;
        var Window = new table();
        Window.addRow();
        Window.addCell(0);
        var Panel = new table();
        Panel.addRow();
        Panel.addRow();
        Panel.addRow();
        Panel.addRow();
        Panel.addRow();
        Panel.addCell(0);
        Panel.addCell(1);
        Panel.addCell(2);
        Panel.addCell(3);
        Panel.addCell(4);
        var titlelabel = new label("БҮРТГҮҮЛЭХ ХЭСЭГ");
        titlelabel._view.attr("class","titlelabel");
        var usernamefield = new textfield();
        var emailfield = new textfield();
        var passwordfield = new textfield();
        usernamefield._view.attr("class","usernamefield");
        emailfield._view.attr("class","emailfield");
        passwordfield._view.attr("class","passwordfield");
        var registerButton = new button("Бүртгүүлэх");
        var loginButton = new button("Нэвтрэх");

        Window.addCellContentOneRow(0, 0, Panel);

        own._view = Window._view;
        own._view.attr("class","RegisterWindow");
        jQuery("body").append(own._view);

        Panel._view.attr("class", "RegisterPanel");
        
        Panel.addCellContentOneRow(0, 0, titlelabel);
        Panel.addCellContentOneRow(1, 0, usernamefield);
        Panel.addCellContentOneRow(2, 0, emailfield);
        Panel.addCellContentOneRow(3, 0, passwordfield);
        Panel.addCellContentOneRow(4, 0, registerButton);
        Panel.addCellContentOneRow(4, 0, loginButton);  
    
        jQuery(registerButton._view).click(function(){
            var newUser = {
                username : usernamefield.getText(),
                password : passwordfield.getText(),
                email : emailfield.getText()
            }
            window.socket.emit('Register', {user : newUser})
        })
        jQuery(passwordfield._view).keypress(function(e){
            if(e.keyCode == 13){
                var newUser = {
                    username : usernamefield.getText(),
                    password : passwordfield.getText(),
                    email : emailfield.getText()
                }
            }
            window.socket.emit('Register', {user : newUser})
        })


        jQuery(loginButton._view).click(function(){
            require(["login.js"],function(LoginWindow){
                own._view.remove();
                var login = new LoginWindow();
            })
        })
        
        Panel._view.on("click",function(){
            jQuery("body .RegisterPanel").removeClass("active");
            Panel._view.addClass("active");
        })
    }
    return RegisterWindow;
})