/*
*Created by Toroo on 2/11/2015
*/
define(function(){
	var _label_ = "<span toroo-class='label'></span>";
	label = function Label(caption){
		var own = this;
        own._view = jQuery(_label_);
        own._view.html(caption);
        own.setText = function(caption){ 
            own._view.html(caption)
        }
    }
    return label;
});