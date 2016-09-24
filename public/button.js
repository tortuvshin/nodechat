/*
    Created by Toroo on 2015/11/2
*/
define(['css!/style.css'], function(){
    var _button_ = "<input type='button'/>";
    Button = function Button(caption){
        var own = this;
        own.caption = caption;
        own._view = jQuery(_button_);
        own._view.val(caption);
        own._view.addClass("node-button");
        jQuery(own._view).on("click", function(){
        })
    }
    return Button;
});   