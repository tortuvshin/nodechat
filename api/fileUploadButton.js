/*
    Created by Toroo on 2015/12/11
*/
define(['css!/style.css'], function(){
    var _button_ = "<input type='file' name = 'img' toroo-class='button'/>";
    UploadButton = function UploadButton(caption){
        var own = this;
        own.caption = caption;
        own._view = jQuery(_button_);
        own._view.val(caption);
        jQuery(own._view).on("change", function(){
            var fileSelect = $(this).val();
        })
    }
    return UploadButton;
});   