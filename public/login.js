define(["/table.min.js","/button.min.js","/textfield.min.js",
    "/label.min.js","/passwordfield.min.js","/ul.min.js",'css!/style.css'], 
	function(table,button,textfield,label,passwordfields,ul){
    var LoginWindow = function(){
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
        Panel.addCell(0);
        Panel.addCell(1);
        Panel.addCell(2);
        Panel.addCell(3);
        Panel.addCell(4);
        Panel.addCell(5);
        Panel.addCell(6);

        var titlelabel = new label("НЭВТРЭХ ХЭСЭГ");
        titlelabel._view.addClass("titlelabel");

        var usernamelabel = new label("Хэрэглэгчийн нэр");
        var usernamefield = new textfield();
        usernamefield._view.addClass("usernamefield");
        usernamelabel._view.addClass("usernamelabel");

        var passwordlabel = new label("Нууц үг");
        var passwordfield = new passwordfields();
        passwordlabel._view.addClass("passwordlabel");
        passwordfield._view.addClass("passwordfield");
        
        var loginError = new ul();
        loginError._view.addClass("loginError");
        var loginButton = new button("Нэвтрэх");
        var registerButton = new button("Бүртгүүлэх");

        Window.addCellContentOneRow(0, 0, Panel);

        own._view = Window._view;
        own._view.addClass("LoginWindow");
        jQuery("body").append(own._view);

        Panel._view.addClass("LoginPanel");
        
        Panel.addCellContentOneRow(0, 0, titlelabel);
        Panel.addCellContentOneRow(1, 0, usernamelabel);
        Panel.addCellContentOneRow(2, 0, usernamefield);
        Panel.addCellContentOneRow(3, 0, passwordlabel);
	    Panel.addCellContentOneRow(4, 0, passwordfield);
	    Panel.addCellContentOneRow(5 ,0, loginError);
	    Panel.addCellContentOneRow(6, 0, loginButton);
	    Panel.addCellContentOneRow(6, 0, registerButton);	
	    loginError._view.hide();
		
        jQuery(loginButton._view).click(function(){
			var userInfo = {
				username : usernamefield.getText(),
				password : passwordfield.getText()
			}
			window.socket.emit("LogIn", {user:userInfo});
			name = userInfo.username;
			window.socket.emit("LoginClient", name);	
		})
		
        jQuery(passwordfield._view).keypress(function(e){
			if(e.keyCode == 13){
			    if(!validate()){
			        return;
			    }
				var userInfo = {
					username : usernamefield.getText(),
					password : passwordfield.getText()
				}
				window.socket.emit("LogIn", {user:userInfo});
				name = userInfo.username;
				window.socket.emit("LoginClient", name);
			}
				
		})
    	
        function validate(){
            var username = usernamefield.getText();
            var password = passwordfield.getText();
            if(username == "" || password == "") {
            	loginError._view.show();
            	loginError.setText("Бүх талбаруудыг бөглөнө үү !");
            	return false;
            }
            return true;
        }
    	
        jQuery(registerButton._view).click(function(){
        	require(["register.js"],function(RegisterWindow){
        		own._view.remove();
        		var register = new RegisterWindow();
        	})
        })
        
        Panel._view.on("click",function(){
            jQuery("body .LoginPanel").removeClass("active");
            Panel._view.addClass("active");
        })
        
        socket.on("LoginCorrect",function(){
            own._view.remove();
        })
        
        socket.on("LoginIncorrect",function(){
	        loginError._view.show();
	        loginError.setText("Хэрэглэгчийн нэр, нууц үг буруу байна.");	
        })
    }
    return LoginWindow;
})