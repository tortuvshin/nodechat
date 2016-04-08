/*
Created by Toroo
*/
define(["css!/style.css"], function(){
    var _textarea_ = "<textarea rows=5 cols=20></textarea>";
    var textArea = function TextArea(){
        var own = this;
        var rows = [];
        own._view = jQuery(_textarea_);
        own._view.attr("toroo-class","textarea");
        own.setText = function(value){ 
            jQuery(own._view).val(value);
        }
		own.appendText = function(value){
			jQuery(own._view).val(jQuery(own._view).val() + '\n' + value);
		}
        own.getText = function(){ 
            return own._view.val();
        }
    }
    return textArea;
});