$( document ).ready(function() {
   var bannersOwl = $("#banner").data('owlCarousel');
   if (bannersOwl) {
     bannersOwl.stop(); // Autoplay Stop
     bannersOwl.options.loop = false;
     bannersOwl.options.autoPlay = false;
   }
});
