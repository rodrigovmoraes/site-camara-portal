$( document ).ready(function() {
   var bannersOwl = $("#banner").data('owlCarousel');
   bannersOwl.stop(); // Autoplay Stop
   bannersOwl.options.loop = false;
   bannersOwl.options.autoPlay = false;
});
