/*
    Created by Toroo
*/
define(["css!/style.css"], function(){
    var _textfield_ = "<input type=text>";
    var textFieldClass = function(){
        var own = this;
        own._view = jQuery(_textfield_);
        own._view.attr("toroo-class","textfield");
        own.setText = function(value){ 
            jQuery(own._view).val(value);
        }
        own.getText = function(){ 
            return own._view.val();
        } 
        jQuery(own._view).on("textFieldClick", function(){
        })        
    }
    return textfield;
});