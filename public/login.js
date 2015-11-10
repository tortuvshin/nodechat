define(["/table.js","/button.js","/textfield.js",'css!/style.css'], 
	function(table,button,textfield){
    var LoginWindow = function(){

        var own = this;
        var Window = new table();
        Window.addRow();
        Window.addCell(0);
        var Panel = new table();
        Panel.addRow();
        Panel.addRow();
        Panel.addRow();

        Panel.addCell(0);
        Panel.addCell(1);
        Panel.addCell(2);

        var username = new textfield();
        var password = new textfield();
        var loginButton = new button("Нэвтрэх");
        var registerButton = new button("Бүртгүүлэх");
        var exit = new button("Гарах");

        Window.addCellContentOneRow(0, 0, Panel);

        own._view = Window._view;
        own._view.attr("class","LoginWindow");
        jQuery("body").append(own._view);

        Panel._view.attr("class", "LoginPanel");
        
        Panel.addCellContentOneRow(0, 0, username);
        Panel.addCellContentOneRow(1, 0, password);
        Panel.addCellContentOneRow(2, 0, loginButton);
        Panel.addCellContentOneRow(2, 0, registerButton);	
        Panel.addCellContentOneRow(2, 0, exit);
    
        jQuery(loginButton._view).click(function(){
        })
        jQuery(registerButton._view).click(function(){
        	require(["register.js"],function(RegisterWindow){
        		own._view.remove();
        		var register = new RegisterWindow();
        	})
        })
        jQuery(exit._view).click(function(){
                own._view.remove();
        })
        Panel._view.on("click",function(){
            jQuery("body .LoginPanel").removeClass("active");
            Panel._view.addClass("active");
        })
    }
    return LoginWindow;
})