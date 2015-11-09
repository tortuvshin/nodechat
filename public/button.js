/*
    Created by Toroo on 2015/11/2
*/
define(['css!/style.css'], function(){
    var _button_ = "<input type='button' toroo-class='button'/>";
    Button = function Button(caption){
        var own = this;
        own.caption = caption;
        own._view = jQuery(_button_);
        own._view.val(caption);
        jQuery(own._view).on("clickButton", function(){
        })
    }
    return Button;
});   