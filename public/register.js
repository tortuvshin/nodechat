define(["table.min.js","button.min.js","textfield.min.js",
    "label.min.js","passwordfield.min.js","ul.min.js","linklabel.min.js",'css!/style.css'], 
    function(table,button,textfield,label,passwordfields,ul,linklabel){
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
        Panel.addRow();
        Panel.addRow();
        Panel.addRow();
        Panel.addRow();
        Panel.addCell(0);
        Panel.addCell(1);
        Panel.addCell(2);
        Panel.addCell(3);
        Panel.addCell(4);
        Panel.addCell(5);
        Panel.addCell(6);
        Panel.addCell(7);
        Panel.addCell(8);
        var titlelabel = new label("БҮРТГҮҮЛЭХ ХЭСЭГ");
        titlelabel._view.addClass("titlelabel");
        var usernamelabel = new label("Хэрэглэгчийн нэр");
        var emaillabel = new label("И-мэйл");
        var passwordlabel = new label("Нууц үг");
        var usernamefield = new textfield();
        var emailfield = new textfield();
        var passwordfield = new passwordfields();
        usernamelabel._view.addClass("usernamelabel");
        usernamefield._view.addClass("usernamefield");
        emaillabel._view.addClass("emaillabel");
        emailfield._view.addClass("emailfield");
        passwordlabel._view.addClass("passwordlabel");
        passwordfield._view.addClass("passwordfield");
        jQuery(passwordfield[type="password"]);
        var registerError = new ul();
        registerError._view.addClass("registerError");
        var registerButton = new button("Бүртгүүлэх");
        var loginButton = new button("Нэвтрэх");
        var loginlinklabel = new linklabel();

        Window.addCellContentOneRow(0, 0, Panel);

        own._view = Window._view;
        own._view.addClass("RegisterWindow");
        jQuery("body").append(own._view);

        Panel._view.addClass("RegisterPanel");
        
        Panel.addCellContentOneRow(0, 0, titlelabel);
        Panel.addCellContentOneRow(1, 0, usernamelabel);
        Panel.addCellContentOneRow(2, 0, usernamefield);
        Panel.addCellContentOneRow(3, 0, emaillabel);  
        Panel.addCellContentOneRow(4, 0, emailfield);  
        Panel.addCellContentOneRow(5, 0, passwordlabel);
        Panel.addCellContentOneRow(6, 0, passwordfield);
        Panel.addCellContentOneRow(7, 0, registerError);
        Panel.addCellContentOneRow(8, 0, registerButton);
        Panel.addCellContentOneRow(8, 0, loginButton);  
        registerError._view.hide();
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
                window.socket.emit('Register', {user : newUser})
            }
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
        socket.on("RegisterCorrect",function(){
            registerError._view.show();
            registerError.setText("Create new user");
            setTimeout(function(){
                own._view.remove();
                require(["login.js"],function(LoginWindow){
                    var login = new LoginWindow();
                })
            },3000)
        })
        socket.on("RegisterNulls",function(){
            registerError._view.show();
            registerError.setText("Бүх талбаруудыг бөглөнө үү !");
        })
        socket.on("AlreadyUser",function(){
            registerError._view.show();
            registerError.setText("Хэрэглэгчийн нэр бүртгэлтэй байна.");
        })
    }
    return RegisterWindow;
})