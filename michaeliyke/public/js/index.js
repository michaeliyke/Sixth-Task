
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
          let obj = {};
          const form = event.target;
          const method = form.dataset.method;
          const elements = form.elements;

          [].slice.call(elements).forEach((element) => {
            if (element.dataset.field != null) {
              obj[element.dataset.field] = element.value;
            }
          });
          switch(method) {
            case "GET":
              if (obj.id == +obj.id) {
                endPoint = `/books/id/${obj.id}`;
              } else {
                for(let element of elements) {
                  if (element.hasAttribute("data-field") && (element.dataset.field.toLowerCase() != "id") 
                    && element.value.trim().length > 0) {
                    endPoint = `/books/${element.dataset.field}/${element.value}`;
                    break;
                  }
                }
                obj = null;
              }
            break;
            case "POST":
            break;
            case "PUT":
            break;
            case "DELETE":
            break;
          }
          pingServer(method, endPoint, obj);
        }

        function pingServer(method, endPoint, obj) {
          // a(endPoint)
          console.log(endPoint);
        }

        ajaxRequest.onreadystatechange = function(event) {
            if (ajaxRequest.status == 200) {
              const obj = JSON.parse(ajaxRequest.responseText);
              let blob = `<option selected>Choose...</option>`;
              for (let i = 0; i < obj.id; i++) {
                blob = blob.concat(`<option value="${i}">${i}</option>`);
              }
              $("select").each((index, select) =>{
                a(select)
                select.innerHTML = blob;
              });

              $("[disabled]", sapi.forms[1]).each(function(index, el) {
              if (el.classList.contains("id")) {
                // el.value = `Auto-generated: ${obj.id}`;
              } else if(el.classList.contains("ISBN")) {
                // el.value = `Auto-generated: ${obj.ISBN}`;
            }
          });
            }
          };
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