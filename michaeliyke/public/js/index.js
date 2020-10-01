
   jQuery((function(w, sapi){
       return function($){
        const a = alert;
         $(sapi.forms).change(function(event) {
            $(this).find("input.input-field").each(function() {
              this.disabled = !this.disabled;
            });
            
         });
       }
    }(window, document)));