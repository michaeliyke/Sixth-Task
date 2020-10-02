
   jQuery((function(w, sapi){
       return function($){
        const a = alert;
         $(sapi.forms).change(function(event) {
           if(event.target.classList.contains("form-check-input")) {
            $(this).find(".input-field").each(function() {
              this.disabled = !this.disabled;
            });
          }

          $(".show-room").text(this.method.toUpperCase());
            
         });
       }
    }(window, document)));