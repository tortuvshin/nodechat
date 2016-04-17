define(["api/table.js","api/button.js","api/labelClass.js","api/textField.js",'css!/style.css'], 
    function(table,button,label,textField){
        /*__jx_protected_*/
    var ChatWindow = function(){
        var own = this;
        var layout = new table();
        layout.addRow();
        layout.addRow();
        layout.addRow();

        layout.addCell(0);
        layout.addCell(1);
        layout.addCell(2);

        layout._view.attr("class","chat");

        own._view = layout._view;
        $("body").append(own._view);

        own._view.attr("class", "chatwindow");
        
        own.setText = function(text){   
            //$(own._view).html(text);
            //layout.addCellConten
            layout.addCellContentOneRow(0, 0, text);
        }
        own.addControl = function(textArea){
            layout.addCellContent(1, 0, textArea);
        }
        own.addControl2 = function(textField){
            layout.addCellContentOneRow(2, 0, textField);
        }
        own.addControl3 = function(sendButton){
            layout.addCellContentOneRow(2, 0, sendButton);
        }
        own.addControl4 = function(sendButton){
            layout.addCellContentOneRow(0, 0, sendButton);
        } 
        own.addControl6 = function(hideButton){
            layout.addCellContentOneRow(0, 0, hideButton);
        } 
        own.addControl5 = function(chatText){
            layout.addCellContentOneRow(0, 0, chatText);
        }
        own.addControl1 = function(showButton){
            layout.addCellContentOneRow(0,0, showButton);
        }

        layout._view.on("click",function(){
            $("body .chatwindow").removeClass("active");
            layout._view.addClass("active");
        })
        //
    }
    return ChatWindow;
});