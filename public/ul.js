
    
    define(["css!/style.css"], function(){
    var html = "<ul></ul>";
    var ulClass = function(){
        var own = this;
        own._view = $(html);
        own.url = "";
        own._view.addClass("css_class","ul");

        $(own._view).on("click", function(){
            $(own).trigger("clickLink");
        })
        own.setText = function(text){
            $(own._view).html(text);
        }
    }
    return ulClass;
});
 