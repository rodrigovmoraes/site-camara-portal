/*Accessibility Code for "www.camarasorocaba.sp.gov.br"*/
(function (doc, head, body) { 
   window.interdeal = { 
      sitekey : "3c051cf6b0c8c2e9f64a4095d996566f", 
      Position : "Left", 
      Menulang : "PT", 
      btnStyle : { 
         color : { 
            main : "#1876C9", 
            second : "#ffffff" 
         } 
      } 
   }; 
   var coreCall = doc.createElement('script'); 
   coreCall.src = 'https://cdn.equalweb.com/core/2.0.2/accessibility.js'; 
   coreCall.defer = true; 
   coreCall.integrity = 'sha512-qoSw5f0i8HNkxw/CGLQyisq1wMNj695s0JAcWXaJ9bhO5l6UBCXQ7BXpfHUxl5cyJsBouPcvht3fh32LZKQbyQ=='; 
   coreCall.crossOrigin = 'anonymous'; 
   coreCall.setAttribute('data-cfasync', true ); 
   body ? body.appendChild(coreCall) : head.appendChild(coreCall); 
}) (document, document.head, document.body);

