define(["/table.js","/button.js","/textfield.js",'css!/style.css'], 
    function(table,button,textfield){
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
        Panel.addCell(0);
        Panel.addCell(1);
        Panel.addCell(2);
        Panel.addCell(3);

        var usernamefield = new textfield();
        var emailfield = new textfield();
        var passwordfield = new textfield();

        var registerButton = new button("Бүртгүүлэх");
        var loginButton = new button("Нэвтрэх");
        var exit = new button("Гарах");

        Window.addCellContentOneRow(0, 0, Panel);

        own._view = Window._view;
        own._view.attr("class","RegisterWindow");
        jQuery("body").append(own._view);

        Panel._view.attr("class", "RegisterPanel");
        
        Panel.addCellContentOneRow(0, 0, usernamefield);
        Panel.addCellContentOneRow(1, 0, emailfield);
        Panel.addCellContentOneRow(2, 0, passwordfield);
        Panel.addCellContentOneRow(3, 0, registerButton);
        Panel.addCellContentOneRow(3, 0, loginButton);  
        Panel.addCellContentOneRow(3, 0, exit);
    
        jQuery(registerButton._view).click(function(){
            var newUser = {
                username : usernamefield.getText(),
                password : passwordfield.getText(),
                email : emailfield.getText()
            }
            window.socket.emit('Register', {user : newUser})
        })
        jQuery(loginButton._view).click(function(){
            require(["login.js"],function(LoginWindow){
                own._view.remove();
                var login = new LoginWindow();
            })
        })
        jQuery(exit._view).click(function(){
                own._view.remove();
        })
        Panel._view.on("click",function(){
            jQuery("body .RegisterPanel").removeClass("active");
            Panel._view.addClass("active");
        })
    }
    return RegisterWindow;
})