
   jQuery((function(w, sapi){
       return function($){
        const a = alert;

        const ajaxRequest = new XMLHttpRequest();
        let endPoint = "/books"
        let form = null;
        let response = {};
        let generateOptions = true;

        function onSubmit(event) {
          event.preventDefault();
          let formData = new FormData();
          const form = event.target;
          const method = form.dataset.method;
          const elements = form.elements;

          [].slice.call(elements).forEach((element) => {
            if (element.dataset.field != null) {
              formData.append([element.dataset.field], element.value);
            }
          });
          switch(method) {
            case "GET":
              if ($("#form-check-input1", form)[0].checked) {
                endPoint = "`/books";
                break
              }
              if (formData.get("id") == +(formData.get("id"))) {
                endPoint = `/books/id/${formData.get("id")}`;
              } else {
                for(let element of elements) {
                  if (element.hasAttribute("data-field") && (element.dataset.field.toLowerCase() != "id") 
                    && element.value.trim().length > 0) {
                    endPoint = `/books/${element.dataset.field}/${element.value}`;
                    break;
                  }
                }
                formData = null;
              }
            break;
            case "POST":
            break;
            case "PUT":
            break;
            case "DELETE":
            break;
          }
          pingServer(method, endPoint, formData);
          formData = null;
        }

        function pingServer(method, endPoint, formData) {
          const request = new XMLHttpRequest();
          request.addEventListener("readystatechange", (event) =>{
            if(this.readyState == 4) {
              $(".show-room").text(request.responseText);
            }
          });
          request.open(method, endPoint);
          if (!formData) {
            request.setRequestHeader("Content-Type", "application/json");
            request.withCredentials = true;
          }
          request.send(formData);
        }




          ajaxRequest.open("GET", "/generate");
          ajaxRequest.send();

          

          $(sapi.forms).submit(onSubmit);

         $(sapi.forms).change(function(event) {
           const target = event.target;
           form = target.form;

           switch(true) {
             case target.classList.contains("form-check-input"):
              $(this).find(".input-field").each(function() {
                this.disabled = !this.disabled;
              });
             break;
            case  ["PUT", "GET", "DELETE"].indexOf(target.form.dataset.method.toUpperCase()) != -1: 
              if (target.tagName.toUpperCase() == "SELECT") {
                endPoint = `/books/${target.dataset.field}/${target.options.selectedIndex}`;
              } else{
                endPoint = `/books/${target.dataset.field}/${target.value}`;
              }
           }

          ajaxRequest.open("GET", endPoint);
          ajaxRequest.send();
            // const method = this.dataset.method.toUpperCase();
            
         });

         ajaxRequest.onreadystatechange = function(event) {
            if (ajaxRequest.status == 200) {
              response = JSON.parse(ajaxRequest.responseText);

              if (generateOptions) {
                generateOptions = false;
                let blob = `<option selected>Choose...</option>`;
              for (let i = 1; i <= response.id; i++) {
                blob = blob.concat(`<option value="${i}">${i}</option>`);
              }
              $("select").html(blob);
              }

              $(".input-field", form).each((index, node) =>{
                if (node.dataset.field in response) {
                  node.value = response[node.dataset.field];
                }
              });
              $(".show-room").text(ajaxRequest.responseText);
            }
          };




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