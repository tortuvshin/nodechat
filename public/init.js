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

require(["socket_io","jquery","text","css", "jquery_cookie", "/body.js"], function(io){
    window.doc = new Body();
    require([],
        function(){
    })
});
