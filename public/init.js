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
    require(["/table.js","/button.js","/textarea.js","linklabel.js","label.js"],
        function(table, button, textarea, linklabel, label){
            
            var mainTable = new table();
            var publicChatTable = new table();
            var privateChatTable = new table();

            doc.append(mainTable);

            mainTable.addRow();
            mainTable.addCell(0);
            mainTable.addCell(0);
            mainTable.addCellContent(0,0,publicChatTable);
            mainTable.addCellContent(0,0,privateChatTable);

            mainTable._view.attr("toroo-class","mainTable");

    })
});
