
   jQuery((function(w, sapi){
       return function($){
        const a = alert;

        const ajaxRequest = new XMLHttpRequest();

        ajaxRequest.onreadystatechange = function(event) {
            if (ajaxRequest.status == 200) {
              console.log(ajaxRequest.responseText);
            }
          };
          ajaxRequest.open("GET", "/generate");
          ajaxRequest.send();


         $(sapi.forms).change(function(event) {
           if(event.target.classList.contains("form-check-input")) {
            $(this).find(".input-field").each(function() {
              this.disabled = !this.disabled;
            });
          }

          ajaxRequest.onreadystatechange = function(event) {
              console.log(ajaxRequest.responseText)
            if (ajaxRequest.status == 200) {
              $(".show-room").text(ajaxRequest.responseText);
            }
          };
          ajaxRequest.open("GET", "/books");
          ajaxRequest.send();
            // const method = this.dataset.method.toUpperCase();
            
         });




       function queryServer(method, fn, options) {
         ajaxRequest.addEventListener("error", (error) => {
           return a(error);
         });
         ajaxRequest.addEventListener("load", (event) => {
           fn.call(null, event.response);
         });
         ajaxRequest.open(method, options.url || "127.0.0.1:3000", false );
         ajaxRequest.send();
       }  
       }
    }(window, document)));