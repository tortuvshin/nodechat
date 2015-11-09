define(["css!style.css"],function(){
    window.Body = function Body(){
        Body.prototype.append = function(c)    {
            $("body").append(c._view)
        }
    }
});