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
    * CALENDAR
    * -------------------------------------------------------------------------*/
    //the next events
    //TODO: events should be get from a Data Service (Camara Data Service)
    var events = [ { date: '20170608', date_description: '19h00', description: 'Sessão Solene: Dia Municipal do Nordestino e Semana da Nordestinidade', place: 'Plenário'},
                   { date: '20170609', date_description: '19h30', description: 'Sessão Solene: Dia do Pastor', place: 'Plenário'},
                   { date: '20170609', date_description: '20h00', description: 'Audiência Pública: Combate ao trabalho infantil', place: 'Plenário'},
                   { date: '20170611', date_description: '19h10', description: 'Sessão Solene: Dia Municipal do Nordestino e Semana da Nordestinidade', place: 'Plenário'},
                   { date: '20170611', date_description: '20h00', description: 'Audiência Pública: Políticas Públicas Sociais', place: 'Plenário'},
                   { date: '20170613', date_description: '19h00', description: 'Entrega de Comenda Mérito em Educação para Leonette Georges Kayal Stefano', place: 'Plenário'},
                   { date: '20170616', date_description: '19h30', description: 'TCE Prof. Hudson Luiz Pissini', place: 'Plenário'}
                ];
   //map of events indexed by day
   var eventsMap = {};

   var buildDateMapForAgenda =  function(pvents, peventsMap) {
      var i;
      for(i = 0; i < pvents.length; i++) {
         var year = pvents[i].date.substr(0, 4);
         var month = pvents[i].date.substr(4, 2);
         var day = pvents[i].date.substr(6, 2);
         var cdate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
         if(peventsMap[cdate]) {
            peventsMap[cdate].push(pvents[i])
         }else{
            peventsMap[cdate] = [];
            peventsMap[cdate].push(pvents[i])
         }

      }
   };

   //build a map for the next events indexed by day
   buildDateMapForAgenda(events, eventsMap);
   var arrMonthsShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Aug", "Set", "Out", "Nov", "Dez"];

   $('#agenda').pickmeup({
     flat: true,
     locale:
      { // Object, that contains localized days of week names and months
         days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
         daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
         daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
         months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Augosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
         monthsShort: arrMonthsShort
      },
      formatted: false,
      mode: 'single',
      date:  new Date(2017, 6 - 1, 8), //TODO: should be now, it is for prototyping purposes
      render: function(date) {
         var cdate = eventsMap[date];
         if(cdate){
            return { class_name: 'events-exist' };
         } else {
            return { class_name: 'events-not-exist' };
         }
      },
      change: function () {
         var newDate = $('#agenda').pickmeup('get_date', false);
         var todayEvents = eventsMap[newDate];
         var eventsDay = newDate.getDate();
         var eventsMonth = arrMonthsShort[newDate.getMonth()];
         if(todayEvents) {
            var sHtmlAgendaTitle = 'Eventos do dia ' + eventsDay + '/' + eventsMonth;
            $('#agenda-title').html(sHtmlAgendaTitle);

            var sHtml = '';
            var i;
            for(i = 0; i < todayEvents.length; i++) {
               var eventDescription = todayEvents[i].description;
               var eventDateDescription = todayEvents[i].date_description;
               var eventPlace = todayEvents[i].place;
               sHtml += '<li>'  +
                        '   <div class="row">'  +
                        '      <div class="col-sm-16  col-md-16 list-item-without-img">'  +
                        '         <h4>' + eventDescription + '</h4>'  +
                        '         <div class="text-danger sub-info">'  +
                        '            <div class="time"><span class="ion-android-data icon"></span>' + eventDateDescription + '</div>'  +
                        '            <div class="place"><span class="ion-location icon"></span>Local: ' + eventPlace + '</div>'  +
                        '         </div>'  +
                        '      </div>'  +
                        '   </div>'  +
                        '</li>';
            }
            $('#day_events').html(sHtml);

         }else {
            $('#agenda-title').html('Agenda');
            $('#day_events').html('');
         }
         return true;
      },

   });

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
         $('.dropdown-menu', this).stop().fadeIn("slow");
       }, function() {
         $('.dropdown-menu', this).stop().fadeOut("slow");
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
    * HOT NEWS
    * -------------------------------------------------------------------------*/
   $('#js-news').ticker();
   // hide the release history when the page loads
   $('#release-wrapper').css('margin-top', '-' + ($('#release-wrapper').height() +
     20) + 'px');
   // show/hide the release history on click
   $('a[href="#release-history"]').toggle(function() {
     $('#release-wrapper').animate({
       marginTop: '0px'
     }, 600, 'linear');
   }, function() {
     $('#release-wrapper').animate({
       marginTop: '-' + ($('#release-wrapper').height() + 20) +
         'px'
     }, 600, 'linear');
   });
   $('#download a').mousedown(function() {
     _gaq.push(['_trackEvent', 'download-button', 'clicked'])
   });

   /* -------------------------------------------------------------------------*
    * OWL CAROUSEL
    * -------------------------------------------------------------------------*/
   $("#banner-thumbs").owlCarousel({
     autoPlay: true, //Set AutoPlay to 3 seconds
     navigation: false,
     stopOnHover: true,
     pagination: false,
     items: 4,
     itemsDesktop: [1199,
       4
     ],
     itemsDesktopSmall: [
       979, 3
     ],
     itemsTablet: [768, 3],
     itemsMobile: [479, 1],

   });

   $("#vid-thumbs").owlCarousel({
     navigation: false,
     pagination: true,
     slideSpeed: 300,
     paginationSpeed: 400,
     singleItem: true,
   });
   $("#owl-lifestyle").owlCarousel({
     autoPlay: false, //Set AutoPlay to 3 seconds
     navigation: true,
     pagination: false,
     items: 3,
     itemsDesktop: [1199,
       3
     ],
     itemsDesktopSmall: [
       979, 2
     ],
     itemsTablet: [768, 2],
     itemsMobile: [479, 1],
   });
   $("#owl-blog").owlCarousel({
     navigation: true,
     pagination: false,
     slideSpeed: 300,
     paginationSpeed: 400,
     singleItem: true,
   });

   var time = 10; // time in seconds
   var $progressBar,
     $bar,
     $elem,
     isPause,
     tick,
     percentTime;
   var rotativeHeadlines = $("#rotativeHeadlines");
   var rotativeHeadlinesSlider = $("#rotativeHeadlinesSlider");
   rotativeHeadlines.owlCarousel({
     autoPlay: false,
     singleItem: true,
     slideSpeed: 1000,
     navigation: true,
     pagination: false,
     transitionStyle: "fadeUp",
     afterAction: syncPosition,
     responsiveRefreshRate: 200,
     afterInit: progressBar,
     afterMove: moved,
     startDragging: pauseOnDragging
   });
   rotativeHeadlinesSlider.owlCarousel({
     items: 4,
     itemsDesktop: [1199,
       4
     ],
     itemsDesktopSmall: [
       979, 3
     ],
     itemsTablet: [768, 3],
     itemsMobile: [479, 3],
     pagination: false,
     responsiveRefreshRate: 100,
     afterInit: function(el) {
       el.find(".owl-item").eq(0).addClass("synced");
     }
   });

   function syncPosition(el) {
     var current = this.currentItem;
     $("#rotativeHeadlinesSlider").find(".owl-item").removeClass("synced").eq(current).addClass(
       "synced")
     if ($("#rotativeHeadlinesSlider").data("owlCarousel") !== undefined) {
       center(current)
     }
   }
   $("#rotativeHeadlinesSlider").on("click", ".owl-item", function(e) {
     e.preventDefault();
     var number = $(this).data("owlItem");
     rotativeHeadlines.trigger("owl.goTo", number);
   });

   function center(number) {
       var rotativeHeadlinesSliderVisible = rotativeHeadlinesSlider.data("owlCarousel").owl.visibleItems;
       var num = number;
       var found = false;
       for (var i in rotativeHeadlinesSliderVisible) {
         if (num === rotativeHeadlinesSliderVisible[i]) {
           var found = true;
         }
       }
       if (found === false) {
         if (num > rotativeHeadlinesSliderVisible[rotativeHeadlinesSliderVisible.length - 1]) {
           rotativeHeadlinesSlider.trigger("owl.goTo", num - rotativeHeadlinesSliderVisible.length + 2)
         } else {
           if (num - 1 === -1) {
             num = 0;
           }
           rotativeHeadlinesSlider.trigger("owl.goTo", num);
         }
       } else if (num === rotativeHeadlinesSliderVisible[rotativeHeadlinesSliderVisible.length - 1]) {
         rotativeHeadlinesSlider.trigger("owl.goTo", rotativeHeadlinesSliderVisible[1])
       } else if (num === rotativeHeadlinesSliderVisible[0]) {
         rotativeHeadlinesSlider.trigger("owl.goTo", num - 1)
       }
     }
     //Init progressBar where elem is $("#owl-demo")
   function progressBar(elem) {
       $elem = elem;
       //build progress bar elements
       buildProgressBar();
       //start counting
       start();
     }
     //create div#progressBar and div#bar then prepend to $("#owl-demo")
   function buildProgressBar() {
     $progressBar = $("<div>", {
       id: "progressBar"
     });
     $bar = $("<div>", {
       id: "bar"
     });
     $progressBar.append($bar).prependTo($elem);
   }

   function start() {
     //reset timer
     percentTime = 0;
     isPause = false;
     //run interval every 0.01 second
     //tick = setInterval(interval, 10);
   };

   function interval() {
       if (isPause === false) {
         percentTime += 1 / time;
         $bar.css({
           width: percentTime + "%"
         });
         //if percentTime is equal or greater than 100
         if (percentTime >= 100) {
           //slide to next item
           $elem.trigger('owl.next')
         }
       }
     }
     //pause while dragging
   function pauseOnDragging() {
       isPause = true;
     }
     //moved callback
   function moved() {
       //clear interval
       clearTimeout(tick);
       //start again
       start();
     }
     //pause on mouseover
   $elem.on('mouseover', function() {
     isPause = true;
   })
   $elem.on('mouseout', function() {
     isPause = false;
   })

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
     autoPlay : false,
     stopOnHover : true,
     navigation:true,
     paginationSpeed : 10000,
     goToFirstSpeed : 10000,
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
