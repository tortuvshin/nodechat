/*
    Created by Toroo
*/
define(["css!/style.css"], function(){
    var _passwordfield_ = "<input type=password>";
    var passwordfield = function(){
        var own = this;
        own._view = jQuery(_passwordfield_);
        own._view.attr("toroo-class","passwordfield");
        own.setText = function(value){ 
            jQuery(own._view).val(value);
        }
        own.getText = function(){ 
            return own._view.val();
        } 
        jQuery(own._view).on("textFieldClick", function(){
        })        
    }
    return passwordfield;
});