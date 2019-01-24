$(document).ready(function() {
   "use strict";

   /* -------------------------------------------------------------------------*
    * PRE LOADER
    * -------------------------------------------------------------------------*/
   $(window).load(function() {
       $('#status').delay(300).fadeOut();
       $('#preloader').delay(300).fadeOut('slow');
     })
     /* -------------------------------------------------------------------------*
      * ADD ANIMATION TO SPECIFIC ELEMENTS
      * -------------------------------------------------------------------------*/
   $('.tags li').hover(function() {
     $(this).find('a').toggleClass("wow flipInY animated");
   });
   //
   $('.f-social li').hover(function() {
     $(this).find('a').toggleClass("wow swing animated");
   });
   $('.social a').hover(function() {
     $(this).find('p').toggleClass("wow fadeInDown animated");
   });
   $('a.read-more').hover(function() {
     $(this).find('span').toggleClass("wow flipInY animated");
   });

   /* -------------------------------------------------------------------------*
    * GO TO TOP
    * -------------------------------------------------------------------------*/
   $.scrollUp();

   /* -------------------------------------------------------------------------*
    * MODAL BOXES & POP UP WINDOWS OR IMAGES
    * -------------------------------------------------------------------------*/
   $('.open-popup-link').magnificPopup({
     removalDelay: 500, //delay removal by X to allow out-animation
     callbacks: {
       beforeOpen: function() {
         this.st.mainClass = this.st.el.attr('data-effect');
       }
     },
     midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
   });
   $('.open-popup-div').magnificPopup({
      type:'inline',
      midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
      overflowY: 'scroll'
   });
   $('#image-popups').magnificPopup({
     delegate: 'a',
     type: 'image',
     removalDelay: 500, //delay removal by X to allow out-animation
     callbacks: {
       beforeOpen: function() {
         // just a hack that adds mfp-anim class to markup
         this.st.image.markup = this.st.image.markup.replace(
           'mfp-figure', 'mfp-figure mfp-with-anim');
         this.st.mainClass = this.st.el.attr('data-effect');
       }
     },
     closeOnContentClick: true,
     midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
   });
   $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
     disableOn: 700,
     type: 'iframe',
     mainClass: 'mfp-fade',
     removalDelay: 160,
     preloader: true,
     fixedContentPos: false
   });

   $('.popup-img').magnificPopup({
     type: 'image'
   });

   // This will create a single gallery from all elements that have class "gallery-item"
   $('.gallery-item').magnificPopup({
     type: 'image',
     gallery: {
       enabled: true
     }
   });

   /* -------------------------------------------------------------------------*
    * MASONRY
    * -------------------------------------------------------------------------*/
   var $container = $('.grid').masonry({
     itemSelector: '.masonry-item',
   });

   /* -------------------------------------------------------------------------*
    * MASONRY BLOG LINK NUDGING
    * -------------------------------------------------------------------------*/
   $('.masonry-item a.more').hover(function() { //mouse in
     $(this).animate({
       paddingLeft: '30px'
     }, 400);
   }, function() { //mouse out
     $(this).animate({
       paddingLeft: 15
     }, 400);
   });

   /* -------------------------------------------------------------------------*
    * SCROLL BAR
    * -------------------------------------------------------------------------*/
   var seq = 0;
   $("html").niceScroll({
     styler: "fb",
     cursorcolor: "#e74c3c"
   });
   $(window).load(function() {
     setTimeout(function() {
       $("#gmbox div").animate({
         'top': 60
       }, 1500, "easeOutElastic");
     }, 1500);
   });

   /* -------------------------------------------------------------------------*
    * WOW ANIMATION
    * -------------------------------------------------------------------------*/
   new WOW().init();

   /* -------------------------------------------------------------------------*
    * SETTING DATE AND TIME
    * -------------------------------------------------------------------------*/
   var datetime = null,
     date = null;
   var update = function() {
     date = moment(new Date())
     date.locale('pt-BR')
     datetime.html(date.format('dddd, D [de] MMMM [de] YYYY, H:mm:ss'));
   };
   datetime = $('#time-date')
   update();
   setInterval(update, 1000);

   /* -------------------------------------------------------------------------*
    * STYLE SWITCHER
    * -------------------------------------------------------------------------*/
   $('#switcher').styleSwitcher({
     useCookie: true
   });

   /* -------------------------------------------------------------------------*
    * SEARCH BAR
    * -------------------------------------------------------------------------*/
   // Hide search wrap by default;
   $(".search-container").hide();
   $(".toggle-search").on("click", function(e) {
     // Prevent default link behavior
     e.preventDefault();
     // Stop propagation
     e.stopPropagation();
     // Toggle search-wrap
     $(".search-container").slideToggle(500, function() {
       // Focus on the search bar
       // When animation is complete
       $("#search-bar").focus();
     });
   });
   // Close the search bar if user clicks anywhere
   $(document).click(function(e) {
     var searchWrap = $(".search-container");
     if (!searchWrap.is(e.target) && searchWrap.has(e.target).length ===
       0) {
       searchWrap.slideUp(500);
     }
   });

   /* -------------------------------------------------------------------------*
    * ADDING SLIDE UP AND ANIMATION TO DROPDOWN
    * -------------------------------------------------------------------------*/
   enquire.register("screen and (min-width:767px)", {

     match: function() {
       $(".dropdown").hover(function() {
         $('> .dropdown-menu', this).stop().fadeIn("slow");
       }, function() {
         $('> .dropdown-menu', this).stop().fadeOut("slow");
       });
     },
   });

 /* -------------------------------------------------------------------------*
    * DROPDOWN LINK NUDGING
    * -------------------------------------------------------------------------*/
   $('.dropdown-menu a').hover(function() { //mouse in
     $(this).animate({
       paddingLeft: '30px'
     }, 400);
   }, function() { //mouse out
     $(this).animate({
       paddingLeft: 20
     }, 400);
   });

   /* -------------------------------------------------------------------------*
    * STICKY NAVIGATION
    * -------------------------------------------------------------------------*/
    /*
    Date: 22/05/2017
    author: Rodrigo Vieira de Moraes

    commented by Rodrigo Moraes to enhance the user experience on mobile
    devices

   $(window).scroll(function() {
     if ($(window).scrollTop() >= 99) {
       $('.nav-search-outer').addClass('navbar-fixed-top');
     }


     if ($(window).scrollTop() >= 100) {
       $('.nav-search-outer').addClass('show');
     } else {
       $('.nav-search-outer').removeClass('show navbar-fixed-top');
     }
   });
   */

   /* -------------------------------------------------------------------------*
   * MINES
   * -------------------------------------------------------------------------*/
   $.extend(true, $.magnificPopup.defaults, {
      tClose: 'Fechar (Esc)', // Alt text on close button
      tLoading: 'Carregando...', // Text that is displayed during loading. Can contain %curr% and %total% keys
      gallery: {
         tPrev: 'Anterior (Tecla de seta para a esquerda)', // Alt text on left arrow
         tNext: 'Próximo (Tecla de seta para a direita)', // Alt text on right arrow
         tCounter: '%curr% de %total%' // Markup for "1 of 7" counter
      },
      image: {
         tError: '<a href="%url%">A imagem</a> não pôde ser carregada.' // Error message when image could not be loaded
      },
      ajax: {
         tError: '<a href="%url%">O conteúdo</a> não pôde ser carregado.' // Error message when ajax request failed
      }
   });

   /*BANNER owlCarousel*/
   var bannerCarousel = $("#banner");
   bannerCarousel.owlCarousel({
     loop: true,
     autoPlay : 5000,
     stopOnHover : true,
     navigation: true,
     paginationSpeed : 1,
     singleItem : true,
     autoHeight : true,
     transitionStyle:"fade",
     pagination: false
   });

   $('.popup-youtube-live-channel').magnificPopup({
     disableOn: 700,
     type: 'iframe',
     mainClass: 'mfp-fade',
     removalDelay: 160,
     preloader: true,
     fixedContentPos: false,
     iframe: {
          markup: '<div class="mfp-iframe-scaler">'+
                    '<div class="mfp-close"></div>'+
                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                  '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button
          patterns: {
            youtube: {
              index: 'www.youtube.com/embed/live_stream', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

              id: 'channel=', // String that splits URL in a two parts, second part should be %id%
              // Or null - full URL will be returned
              // Or a function that should return %id%, for example:
              // id: function(url) { return 'parsed id'; }

              src: 'https://www.youtube.com/embed/live_stream?channel=%id%&autoplay=1' // URL that will be set as a source for iframe.
            },
            srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
          }
     }
   });

   $('.popup-flickr-gallery').magnificPopup({
      type: 'ajax',
      closeOnContentClick: false,
      closeOnBgClick: false
   });

 });

 /* -------------------------------------------------------------------------*
 * WEATHER
 * -------------------------------------------------------------------------*/
$.simpleWeather({
   location: '',
   woeid: '455913',
   unit: 'c',
   success: function(weather) {
     html = '<i class="icon-' + weather.code + '"></i> ' + weather.city +
      ', ' + weather.region + ' ' + weather.temp + '&deg;' +
      weather.units.temp + ' ';
     $("#weather").html(html);
   },
   error: function(error) {
     $("#weather").html('<p>' + error + '</p>');
   }
});
